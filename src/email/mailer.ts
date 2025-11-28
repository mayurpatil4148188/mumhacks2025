import nodemailer from "nodemailer";
import { AlertDocument } from "@/models/StudentTestInstance";
import { User } from "@/models/User";

export async function sendAlertEmail(alert: AlertDocument) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });

  const student = await User.findById(alert.studentId);
  const recipients = (process.env.EMAIL_FROM || "alerts@example.com").split(",");

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: recipients,
    subject: `MITR Alert for ${student?.name || "student"}`,
    text: `Domains flagged: ${alert.domainFlags
      .map((d) => `${d.domain} (risk ${d.riskLevel})`)
      .join(", ")}`,
  });
}
