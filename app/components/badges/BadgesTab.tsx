import type { Badge } from "@/app/lib/types";
import BadgeCard from "./BadgeCard";

interface BadgesTabProps {
  badges: Badge[];
  unlockedBadges: number;
}

export default function BadgesTab({ badges, unlockedBadges }: BadgesTabProps) {
  return (
    <div className="px-4 py-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold">Conquistas</h2>
        <span className="text-xs text-muted">
          {unlockedBadges}/{badges.length} desbloqueadas
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {badges.map((badge, i) => (
          <BadgeCard
            key={badge.slug}
            badge={badge}
            animationDelay={i * 60}
          />
        ))}
      </div>
    </div>
  );
}
