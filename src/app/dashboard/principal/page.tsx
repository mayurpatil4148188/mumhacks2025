import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/db/connection";
import { Alert, AIScoringResult, StudentTestInstance } from "@/models/StudentTestInstance";
import { User } from "@/models/User";
import { principalNav } from "./nav";
import { isDummyMode } from "@/lib/env";
import { dummyAlerts, dummyStudents, dummyAnalytics } from "@/lib/dummy-data";
import { DomainDistributionChart } from "@/components/charts/domain-distribution-chart";
import { RiskTrendChart } from "@/components/charts/risk-trend-chart";
import { GradeRiskChart } from "@/components/charts/grade-risk-chart";
import { AlertLevelChart } from "@/components/charts/alert-level-chart";
import { AssessmentTrendChart } from "@/components/charts/assessment-trend-chart";
import { SectionStatsChart } from "@/components/charts/section-stats-chart";

type AlertRow = {
  id: string;
  student: string;
  domain: string;
  level: string;
};

export default async function PrincipalDashboard() {
  const session = await getAuthSession();
  if (!session || !session.user.schoolId) {
    throw new Error("Unauthorized or school not found.");
  }

  let activeAlerts: any[] = [];
  let avgRisk = 0;
  let baselineCount = 0;
  let followupCount = 0;
  let alerts: AlertRow[] = [];
  let analytics: any = null;

  if (isDummyMode()) {
    activeAlerts = dummyAlerts.slice(0, 10);
    avgRisk = 1.67; // Average of risk levels 1, 2, 3
    baselineCount = dummyStudents.filter((s) => s.baselineDone).length;
    followupCount = dummyStudents.reduce((sum, s) => sum + s.followupCount, 0);
    const studentNameMap = new Map(dummyStudents.map((s) => [s.id, s.name]));
    alerts = activeAlerts.map((a: any) => ({
      id: a._id.toString(),
      student: studentNameMap.get(a.studentId?.toString() || "") || "Student",
      domain: (a.domainFlags && a.domainFlags[0]?.domain) || "N/A",
      level: (a.domainFlags && a.domainFlags[0]?.alertLevel) || a.status || "OPEN",
    }));
    analytics = dummyAnalytics;
  } else {
    await dbConnect();
    const schoolId = session.user.schoolId;

    const [fetchedAlerts, calculatedAvgRisk, baseline, followup] = await Promise.all([
      Alert.find({ schoolId, status: "OPEN" }).sort({ createdAt: -1 }).limit(10).lean(),
      (async () => {
        const results = await AIScoringResult.find({ schoolId }).sort({ createdAt: -1 }).limit(25).lean();
        const scores = results.flatMap((r) => r.domainScores?.map((d) => d.riskLevel) || []);
        if (!scores.length) return 0;
        return Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2));
      })(),
      StudentTestInstance.countDocuments({ schoolId, templateType: "BASELINE", status: "COMPLETED" }),
      StudentTestInstance.countDocuments({ schoolId, templateType: "FOLLOWUP", status: "COMPLETED" }),
    ]);

    activeAlerts = fetchedAlerts;
    avgRisk = calculatedAvgRisk;
    baselineCount = baseline;
    followupCount = followup;

    const studentIds = Array.from(new Set(activeAlerts.map((a) => a.studentId?.toString()).filter(Boolean)));
    const students = studentIds.length
      ? await User.find({ _id: { $in: studentIds } })
          .select("_id name")
          .lean()
      : [];
    const studentNameMap = new Map(students.map((s) => [s._id.toString(), s.name || "Student"]));

    alerts = activeAlerts.map((a: any) => ({
      id: a._id.toString(),
      student: studentNameMap.get(a.studentId?.toString() || "") || "Student",
      domain: (a.domainFlags && a.domainFlags[0]?.domain) || "N/A",
      level: (a.domainFlags && a.domainFlags[0]?.alertLevel) || a.status || "OPEN",
    }));
    // For non-dummy mode, calculate analytics from real data
    analytics = null; // TODO: Calculate from real data
  }

  return (
    <DashboardShell
      title="Principal overview"
      description="Monitor your school across classes, risk domains, and staff actions."
      nav={principalNav}
    >
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-slate-500">Active alerts</p>
          <p className="text-3xl font-bold">{alerts.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Avg risk (last 25)</p>
          <p className="text-3xl font-bold">{avgRisk}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Baseline completed</p>
          <p className="text-3xl font-bold">{baselineCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Follow-ups completed</p>
          <p className="text-3xl font-bold">{followupCount}</p>
        </Card>
      </div>

      {/* Analytics Charts - Only visible in dummy mode */}
      {isDummyMode() && analytics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-4">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Domain Distribution</h3>
            <DomainDistributionChart data={analytics.domainDistribution} />
          </Card>
          <Card className="p-4">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Risk Trend (7 days)</h3>
            <RiskTrendChart data={analytics.riskTrend} />
          </Card>
          <Card className="p-4">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Grade-wise Risk</h3>
            <GradeRiskChart data={analytics.gradeWiseRisk} />
          </Card>
          <Card className="p-4">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Alert Level Breakdown</h3>
            <AlertLevelChart data={analytics.alertLevelBreakdown} />
          </Card>
          <Card className="p-4">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Assessment Trends</h3>
            <AssessmentTrendChart data={analytics.assessmentTrends} />
          </Card>
          <Card className="p-4">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Section Statistics</h3>
            <SectionStatsChart data={analytics.sectionWiseStats} />
          </Card>
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Open alerts</h2>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Domain</th>
                <th className="px-4 py-3">Level</th>
              </tr>
            </thead>
            <tbody>
              {alerts.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-slate-600" colSpan={3}>
                    No open alerts right now.
                  </td>
                </tr>
              ) : (
                alerts.map((alert) => (
                  <tr key={alert.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-900">{alert.student}</td>
                    <td className="px-4 py-3 text-slate-600">{alert.domain}</td>
                    <td className="px-4 py-3">
                      <Badge variant={alert.level === "RED" ? "danger" : "warning"}>{alert.level}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardShell>
  );
}
