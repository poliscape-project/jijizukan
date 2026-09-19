import React from "react";
import type { TopicStatus } from "@/types/topic";
import {
  Clock,
  CheckCircle2,
  Pause,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

const STATUS_CONFIG: Record<
  TopicStatus,
  { label: string; bg: string; text: string; icon: React.ElementType }
> = {
  ongoing: {
    label: "進行中",
    bg: "bg-amber-50",
    text: "text-amber-800",
    icon: Clock,
  },
  resolved: {
    label: "決着",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    icon: CheckCircle2,
  },
  stalled: {
    label: "停滞",
    bg: "bg-slate-100",
    text: "text-slate-700",
    icon: Pause,
  },
  escalating: {
    label: "緊張激化",
    bg: "bg-rose-50",
    text: "text-rose-800",
    icon: AlertTriangle,
  },
  new: {
    label: "新規",
    bg: "bg-blue-50",
    text: "text-blue-800",
    icon: Sparkles,
  },
};

interface StatusBadgeProps {
  status: TopicStatus;
  label?: string;
  size?: "sm" | "md";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = "sm",
}) => {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const displayLabel = label || config.label;

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${config.bg} ${config.text} ${
        size === "sm"
          ? "text-[11px] px-2 py-0.5"
          : "text-xs px-2.5 py-1"
      } ${
        status === "ongoing"
          ? "border-amber-200/70"
          : status === "resolved"
          ? "border-emerald-200/70"
          : status === "stalled"
          ? "border-slate-200/70"
          : status === "escalating"
          ? "border-rose-200/70"
          : "border-blue-200/70"
      }`}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {displayLabel}
    </span>
  );
};
