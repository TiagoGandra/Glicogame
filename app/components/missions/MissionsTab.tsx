import type { Mission } from "@/app/lib/types";
import MissionCard from "./MissionCard";

interface MissionsTabProps {
  missions: Mission[];
  completedMissions: number;
  onToggleMission: (id: string) => void;
}

export default function MissionsTab({
  missions,
  completedMissions,
  onToggleMission,
}: MissionsTabProps) {
  return (
    <div className="px-4 py-4 space-y-3 animate-fade-in">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-semibold">Missões do Dia</h2>
        <span className="text-xs text-muted">
          {completedMissions}/{missions.length} completas
        </span>
      </div>

      <div className="xp-bar-bg">
        <div
          className="xp-bar-fill"
          style={{ width: `${(completedMissions / missions.length) * 100}%` }}
        />
      </div>

      {missions.map((mission, i) => (
        <MissionCard
          key={mission.id}
          mission={mission}
          animationDelay={i * 60}
          onToggle={onToggleMission}
        />
      ))}
    </div>
  );
}
