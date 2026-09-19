import React from "react";
import type { KeyActor } from "@/types/topic";

interface KeyActorsBarProps {
  actors: KeyActor[];
}

export const KeyActorsBar: React.FC<KeyActorsBarProps> = ({ actors }) => {
  if (actors.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {actors.map((actor, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-sm px-3 py-1.5 rounded-lg border border-slate-200"
        >
          {actor.flag && <span className="text-base">{actor.flag}</span>}
          <span className="font-medium">{actor.name}</span>
          {actor.role && (
            <span className="text-[11px] text-slate-500">({actor.role})</span>
          )}
        </span>
      ))}
    </div>
  );
};
