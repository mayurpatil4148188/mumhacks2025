import { DomainScore } from "@/types";

export function decideAlerts(domainScores: DomainScore[]) {
  const flags = domainScores
    .filter((s) => s.riskLevel >= 1)
    .map((s) => ({ domain: s.domain, riskLevel: s.riskLevel, alertLevel: "YELLOW" as const }));

  const selfHarm = domainScores.find((s) => s.domain === "Self-harm risk" && s.riskLevel >= 2);
  if (selfHarm) {
    flags.push({ domain: selfHarm.domain, riskLevel: selfHarm.riskLevel, alertLevel: "RED" });
  }

  const bullying = domainScores.find((s) => s.domain === "Bullying" && s.riskLevel >= 2);
  const isolation = domainScores.find((s) => s.domain === "Social isolation" && s.riskLevel >= 2);
  if (bullying && isolation) {
    flags.push({ domain: "Bullying & Social isolation", riskLevel: 2, alertLevel: "RED" });
  }

  const multipleLowLevel = domainScores.filter((s) => s.riskLevel >= 1).length >= 2;
  if (multipleLowLevel) {
    flags.push({ domain: "Multi-domain", riskLevel: 1, alertLevel: "YELLOW" });
  }

  const alertLevel = flags.some((f) => f.alertLevel === "RED") ? "RED" : flags.length ? "YELLOW" : null;
  return { alertLevel, domainFlags: flags };
}
