import type { UserProfile, GlucoseEntry } from "@/app/lib/types";
import LevelCard from "./LevelCard";
import StatsGrid from "./StatsGrid";
import GlucoseChart from "./GlucoseChart";

interface StatusTabProps {
  user: UserProfile;
  xpPercent: number;
  glucoseData: GlucoseEntry[];
  completedMissions: number;
  unlockedBadges: number;
}

export default function StatusTab({
  user,
  xpPercent,
  glucoseData,
  completedMissions,
  unlockedBadges,
}: StatusTabProps) {
  return (
    <div className="px-4 py-4 space-y-4 animate-fade-in">
      <LevelCard
        nivel={user.nivel}
        xp_total={user.xp_total}
        xp_proximo={user.xp_proximo}
        xpPercent={xpPercent}
      />

      <StatsGrid
        streakDias={user.streak_dias}
        missoesConcluidas={completedMissions}
        conquistasDesbloqueadas={unlockedBadges}
      />

      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Glicose Hoje</h2>
          <span className="text-[11px] text-muted px-2 py-0.5 rounded-full bg-border/50">mg/dL</span>
        </div>
        <GlucoseChart data={glucoseData} />
        {glucoseData.length > 0 && (
          <div className="flex items-center gap-4 mt-3 text-[10px] text-muted">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-accent" /> Glicose
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-accent/20" /> Faixa alvo (70-140)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
