import { getServerSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { User } from "@/models/User";
import { dbConnect } from "@/db/connection";
import { normalizeEmail } from "@/lib/utils";
import { credentialsSchema } from "@/lib/validators";
import { Role } from "@/types";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;
        await dbConnect();
        const user = await User.findOne({ email: normalizeEmail(parsed.data.email) });
        if (!user) return null;
        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          schoolId: user.schoolId ? user.schoolId.toString() : null,
        } as any;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.schoolId = (user as any).schoolId || null;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role as Role;
      session.user.schoolId = (token.schoolId as string | null) || null;
      session.user.id = token.sub as string;
      return session;
    },
  },
};

export async function getAuthSession() {
  return getServerSession(authOptions);
}

export async function requireRole(requiredRoles: Role | Role[]) {
  const session = await getAuthSession();
  if (!session) throw new Error("Unauthorized");
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  if (!roles.includes(session.user.role)) throw new Error("Forbidden");
  return session;
}

export async function requireSchoolScopedUser(schoolId: string) {
  const session = await getAuthSession();
  if (!session) throw new Error("Unauthorized");
  if (!session.user.schoolId || session.user.schoolId !== schoolId) {
    throw new Error("School scope mismatch");
  }
  return session;
}
