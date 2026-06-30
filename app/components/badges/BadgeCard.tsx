import type { Badge } from "@/app/lib/types";

interface BadgeCardProps {
  badge: Badge;
  animationDelay?: number;
}

export default function BadgeCard({ badge, animationDelay = 0 }: BadgeCardProps) {
  return (
    <div
      className={`badge-card animate-fade-in ${!badge.unlocked ? "locked" : ""}`}
      style={{ animationDelay: `${animationDelay}ms` }}
      id={`badge-${badge.slug}`}
    >
      <div className="text-3xl mb-2">{badge.icone}</div>
      <p className="text-xs font-semibold">{badge.titulo}</p>
      <p className="text-[10px] text-muted mt-1 leading-relaxed">{badge.descricao}</p>
      {badge.unlocked && (
        <span className="inline-block mt-2 text-[9px] uppercase tracking-wider text-accent font-semibold px-2 py-0.5 rounded-full bg-accent/10">
          Desbloqueada
        </span>
      )}
    </div>
  );
}
