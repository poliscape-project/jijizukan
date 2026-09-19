import React from "react";
import type { RelatedPolicy } from "@/types/topic";
import { BookMarked, ArrowUpRight } from "lucide-react";

interface RelatedPoliciesProps {
  policies: RelatedPolicy[];
}

const SEISAKU_BASE_URL = "https://poliscape.vercel.app/policies";

export const RelatedPolicies: React.FC<RelatedPoliciesProps> = ({
  policies,
}) => {
  if (policies.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
        <BookMarked className="w-4 h-4 text-teal-600" />
        関連する政策（日本政策図鑑）
      </h3>
      <div className="space-y-2">
        {policies.map((policy) => (
          <a
            key={policy.id}
            href={`${SEISAKU_BASE_URL}/${policy.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 bg-teal-50/50 rounded-lg border border-teal-200/50 hover:bg-teal-50 hover:border-teal-300/60 transition-all group"
          >
            <BookMarked className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-teal-900 group-hover:text-teal-700 flex items-center gap-1">
                {policy.title}
                <ArrowUpRight className="w-3 h-3 text-teal-500" />
              </p>
              <p className="text-xs text-teal-600 mt-0.5">
                {policy.relationship}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
