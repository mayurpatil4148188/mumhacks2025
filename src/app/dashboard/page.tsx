import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";

const roleHome: Record<string, string> = {
  MASTER_ADMIN: "/dashboard/master-admin",
  PRINCIPAL: "/dashboard/principal",
  TEACHER: "/dashboard/teacher",
  PARENT: "/dashboard/parent",
  STUDENT: "/dashboard/student",
};

export default async function DashboardRouter() {
  const session = await getAuthSession();
  if (!session) {
    redirect("/auth/login");
  }

  const target = roleHome[session.user.role] || "/auth/login";
  redirect(target);
}
