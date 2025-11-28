import "./globals.css";
import { Space_Grotesk } from "next/font/google";
import { ReactNode } from "react";
import { SessionProvider } from "@/components/providers/session-provider";

const font = Space_Grotesk({ subsets: ["latin"] });

export const metadata = {
  title: "MITR – Student Well-Being Portal",
  description: "Multi-tenant emotional well-being assessments for schools.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
