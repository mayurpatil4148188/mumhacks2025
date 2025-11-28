import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-br from-emerald-100/70 via-transparent to-sky-100/60 blur-3xl" />
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-200">
            M
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              MITR
            </p>
            <p className="text-sm text-slate-600">Student Well-Being Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost">
            <Link href="/auth/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/master-admin">Admin console</Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 px-6 pb-16 md:px-12">
        <section className="mx-auto max-w-5xl space-y-8 rounded-3xl border border-slate-100/70 bg-white/80 p-10 shadow-2xl shadow-emerald-100/60 backdrop-blur">
          <Badge className="bg-emerald-100 text-emerald-800">Multi-tenant · Secure · Caring</Badge>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
              Run safe, adaptive check-ins across every school, class, and student.
            </h1>
            <p className="text-lg text-slate-600 sm:text-xl">
              Principals, teachers, parents, and students share one secure platform. AI-assisted
              scoring, alerts, and guidance keep well-being insights flowing without exposing
              sensitive labels to students.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/login">Get started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard/teacher">See teacher view</Link>
            </Button>
            <p className="text-sm text-slate-500">OpenAI-powered scoring · Email alerts</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-emerald-100/80 bg-emerald-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Alerts
              </p>
              <p className="mt-2 text-lg font-semibold text-emerald-900">Domain-aware flags</p>
              <p className="text-sm text-emerald-800/80">
                RED/YELLOW rules and email notifications for principals and class teachers.
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Assessments
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">Baseline + follow-ups</p>
              <p className="text-sm text-slate-600">
                25-question baseline plus adaptive follow-ups tuned to risk domains and preferences.
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Dashboards
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">Role-specific views</p>
              <p className="text-sm text-slate-600">
                Master admin, principal, teacher, parent, and student portals with scoped access.
              </p>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
