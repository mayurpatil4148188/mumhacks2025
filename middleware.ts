import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const roleAccess: { prefix: string; roles: string[] }[] = [
  { prefix: "/dashboard/master-admin", roles: ["MASTER_ADMIN"] },
  { prefix: "/dashboard/principal", roles: ["MASTER_ADMIN", "PRINCIPAL"] },
  { prefix: "/dashboard/teacher", roles: ["MASTER_ADMIN", "PRINCIPAL", "TEACHER"] },
  { prefix: "/dashboard/parent", roles: ["PARENT"] },
  { prefix: "/dashboard/student", roles: ["STUDENT"] },
];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role as string | undefined;

    if (!pathname.startsWith("/dashboard")) {
      return NextResponse.next();
    }

    if (!role) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const match = roleAccess.find((r) => pathname.startsWith(r.prefix));
    if (match && !match.roles.includes(role)) {
      // Send to their own dashboard router which will redirect appropriately.
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => Boolean(token),
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
