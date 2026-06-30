import type { Mission } from "@/app/lib/types";

interface MissionCardProps {
  mission: Mission;
  animationDelay?: number;
  onToggle: (id: string) => void;
}

export default function MissionCard({ mission, animationDelay = 0, onToggle }: MissionCardProps) {
  const isDone = mission.status === "concluida";

  return (
    <button
      onClick={() => onToggle(mission.id)}
      className={`mission-card w-full text-left animate-fade-in ${isDone ? "completed" : ""}`}
      style={{ animationDelay: `${animationDelay}ms` }}
      id={`mission-${mission.id}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
            isDone ? "bg-success border-success" : "border-muted"
          }`}
        >
          {isDone && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${isDone ? "line-through text-muted" : ""}`}>
            {mission.titulo}
          </p>
          <p className="text-xs text-muted mt-0.5">{mission.descricao}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[11px] text-muted">{mission.horario}</p>
          <p className="text-[11px] font-semibold text-accent">+{mission.xp_recompensa} XP</p>
        </div>
      </div>
    </button>
  );
}
