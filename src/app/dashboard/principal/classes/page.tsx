import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/db/connection";
import { StudentProfile } from "@/models/StudentProfile";
import { Alert, AIScoringResult, StudentTestInstance } from "@/models/StudentTestInstance";
import { principalNav } from "../nav";
import { isDummyMode } from "@/lib/env";
import { dummyClasses } from "@/lib/dummy-data";
import { GradeRiskChart } from "@/components/charts/grade-risk-chart";
import { SectionStatsChart } from "@/components/charts/section-stats-chart";
import { DomainDistributionChart } from "@/components/charts/domain-distribution-chart";
import Link from "next/link";
import { ClassDomainChart } from "@/components/charts/class-domain-chart";

type ClassData = {
  id: string;
  grade: string;
  section: string;
  teacher: string;
  studentCount: number;
  baselineCompleted: number;
  followupsCompleted: number;
  activeAlerts: number;
  avgRisk: number;
  domainBreakdown: { domain: string; count: number; avgRisk: number }[];
};

export default async function PrincipalClassesPage() {
  const session = await getAuthSession();
  if (!session || !session.user.schoolId) {
    throw new Error("Unauthorized or school not found.");
  }

  let classes: ClassData[] = [];
  let classAnalytics: any = null;

  if (isDummyMode()) {
    classes = dummyClasses;
    classAnalytics = {
      gradeWiseRisk: dummyClasses.map((c) => ({
        grade: `Grade ${c.grade}`,
        avgRisk: c.avgRisk,
        studentCount: c.studentCount,
        alerts: c.activeAlerts,
      })),
      sectionWiseStats: dummyClasses.map((c) => ({
        section: `${c.grade}${c.section}`,
        students: c.studentCount,
        baselineCompleted: c.baselineCompleted,
        followups: c.followupsCompleted,
        alerts: c.activeAlerts,
      })),
      domainDistribution: dummyClasses.flatMap((c) => c.domainBreakdown).reduce((acc, item) => {
        const existing = acc.find((a: any) => a.domain === item.domain);
        if (existing) {
          existing.count += item.count;
        } else {
          acc.push({ ...item });
        }
        return acc;
      }, [] as any[]),
    };
  } else {
    await dbConnect();
    const schoolId = session.user.schoolId;
    const profiles = await StudentProfile.find({ schoolId }).lean();
    
    // Group by grade and section
    const classMap = new Map<string, ClassData>();
    
    for (const profile of profiles) {
      const key = `${profile.grade}-${profile.section}`;
      if (!classMap.has(key)) {
        classMap.set(key, {
          id: key,
          grade: profile.grade || "",
          section: profile.section || "",
          teacher: "TBD",
          studentCount: 0,
          baselineCompleted: 0,
          followupsCompleted: 0,
          activeAlerts: 0,
          avgRisk: 0,
          domainBreakdown: [],
        });
      }
      const classData = classMap.get(key)!;
      classData.studentCount++;
    }

    // Calculate metrics for each class
    for (const [key, classData] of classMap.entries()) {
      const [grade, section] = key.split("-");
      const studentIds = profiles
        .filter((p) => p.grade === grade && p.section === section)
        .map((p) => p.userId);
      
      if (studentIds.length > 0) {
        const [baselines, followups, alerts, scores] = await Promise.all([
          StudentTestInstance.countDocuments({
            schoolId,
            studentId: { $in: studentIds },
            templateType: "BASELINE",
            status: "COMPLETED",
          }),
          StudentTestInstance.countDocuments({
            schoolId,
            studentId: { $in: studentIds },
            templateType: "FOLLOWUP",
            status: "COMPLETED",
          }),
          Alert.countDocuments({
            schoolId,
            studentId: { $in: studentIds },
            status: "OPEN",
          }),
          AIScoringResult.find({
            schoolId,
            studentId: { $in: studentIds },
          })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean(),
        ]);

        classData.baselineCompleted = baselines;
        classData.followupsCompleted = followups;
        classData.activeAlerts = alerts;
        
        const riskScores = scores.flatMap((s) => s.domainScores?.map((d) => d.riskLevel) || []);
        classData.avgRisk = riskScores.length > 0
          ? Number((riskScores.reduce((a, b) => a + b, 0) / riskScores.length).toFixed(2))
          : 0;
      }
    }

    classes = Array.from(classMap.values());
  }

  return (
    <DashboardShell
      title="Classes"
      description="Monitor class performance, risk levels, and assessment completion."
      nav={principalNav}
    >
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-slate-500">Total classes</p>
          <p className="text-3xl font-bold">{classes.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Total students</p>
          <p className="text-3xl font-bold">{classes.reduce((sum, c) => sum + c.studentCount, 0)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Avg risk across classes</p>
          <p className="text-3xl font-bold">
            {classes.length > 0
              ? (classes.reduce((sum, c) => sum + c.avgRisk, 0) / classes.length).toFixed(2)
              : "0.00"}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Total active alerts</p>
          <p className="text-3xl font-bold">{classes.reduce((sum, c) => sum + c.activeAlerts, 0)}</p>
        </Card>
      </div>

      {/* Class-level Analytics Charts - Only in dummy mode */}
      {isDummyMode() && classAnalytics && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Grade-wise Risk Distribution</h3>
            <GradeRiskChart data={classAnalytics.gradeWiseRisk} />
          </Card>
          <Card className="p-4">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Section Statistics</h3>
            <SectionStatsChart data={classAnalytics.sectionWiseStats} />
          </Card>
          <Card className="p-4 md:col-span-2">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Domain Distribution Across Classes</h3>
            <DomainDistributionChart data={classAnalytics.domainDistribution} />
          </Card>
        </div>
      )}

      {/* Classes List */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Class details</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((classItem) => (
            <Card key={classItem.id} className="space-y-4 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Grade {classItem.grade} • Section {classItem.section}
                  </h3>
                  <p className="text-sm text-slate-600">Teacher: {classItem.teacher}</p>
                </div>
                <Badge variant={classItem.avgRisk >= 2 ? "danger" : classItem.avgRisk >= 1 ? "warning" : "success"}>
                  Risk: {classItem.avgRisk.toFixed(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-500">Students</p>
                  <p className="text-lg font-semibold text-slate-900">{classItem.studentCount}</p>
                </div>
                <div>
                  <p className="text-slate-500">Baseline</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {classItem.baselineCompleted}/{classItem.studentCount}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Follow-ups</p>
                  <p className="text-lg font-semibold text-slate-900">{classItem.followupsCompleted}</p>
                </div>
                <div>
                  <p className="text-slate-500">Alerts</p>
                  <p className="text-lg font-semibold text-slate-900">{classItem.activeAlerts}</p>
                </div>
              </div>

              {/* Domain Breakdown Chart for this class */}
              {isDummyMode() && classItem.domainBreakdown.length > 0 && (
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <h4 className="mb-2 text-xs font-semibold text-slate-700">Domain breakdown</h4>
                  <ClassDomainChart data={classItem.domainBreakdown} />
                </div>
              )}

              <Link
                href={`/dashboard/principal/students?grade=${classItem.grade}&section=${classItem.section}`}
                className="block text-center text-sm text-emerald-700 underline-offset-2 hover:underline"
              >
                View students →
              </Link>
            </Card>
          ))}
        </div>
        {classes.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-slate-600">No classes found.</p>
          </Card>
        )}
      </section>
    </DashboardShell>
  );
}

