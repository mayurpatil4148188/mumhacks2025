import NextAuth from "next-auth";
import { Role } from "@/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: Role;
      schoolId: string | null;
    };
  }

  interface User {
    role: Role;
    schoolId: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    schoolId?: string | null;
  }
}
