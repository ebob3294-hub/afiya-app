import { useLang } from "@/lib/lang";
import { formatValue, type Level } from "@/lib/nutrition";

const LEVEL_CLASS: Record<Level, string> = {
  safe: "bg-safe/10 text-safe",
  caution: "bg-caution/10 text-caution",
  danger: "bg-danger/10 text-danger",
  info: "bg-muted text-muted-foreground",
};

export function NutrientRow({
  label,
  value,
  unit,
  level,
}: {
  label: string;
  value: number | null;
  unit: "kcal" | "g" | "mg";
  level: Level;
}) {
  const { t } = useLang();
  const levelLabel =
    level === "safe" ? t.levelSafe : level === "caution" ? t.levelCaution : level === "danger" ? t.levelDanger : t.levelInfo;
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3">
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-base font-semibold text-foreground">{label}</span>
        <span className="text-sm text-muted-foreground">
          {formatValue(value, unit)} {unit}
        </span>
      </div>
      <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${LEVEL_CLASS[level]}`}>{levelLabel}</span>
    </div>
  );
}
