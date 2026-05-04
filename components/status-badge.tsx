import { Badge } from "@/components/ui/badge";
import { statusLabel } from "@/lib/i18n";
import type { RiskLevel } from "@/types";

export function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "Safe" || status === "Resolved" || status === "Released to Seller"
      ? "success"
      : status === "Caution" || status === "Waiting Evidence" || status.includes("Waiting")
        ? "warning"
        : status === "Critical" || status === "High Risk" || status === "Escalated" || status === "Disputed"
          ? "danger"
          : status.includes("Mule")
            ? "purple"
            : "default";
  return <Badge variant={variant as Parameters<typeof Badge>[0]["variant"]}>{statusLabel(status)}</Badge>;
}

export function RiskLevelBadge({ level }: { level: RiskLevel }) {
  return <StatusBadge status={level} />;
}
