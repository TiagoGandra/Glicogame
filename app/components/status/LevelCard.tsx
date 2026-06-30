interface LevelCardProps {
  nivel: number;
  xp_total: number;
  xp_proximo: number;
  xpPercent: number;
}

export default function LevelCard({ nivel, xp_total, xp_proximo, xpPercent }: LevelCardProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-muted uppercase tracking-wider font-medium">Nível Atual</p>
          <p className="text-3xl font-bold text-accent mt-1">{nivel}</p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-dark to-accent flex items-center justify-center animate-pulse-glow">
          <span className="text-2xl font-bold text-white">{nivel}</span>
        </div>
      </div>
      <div>
        <div className="flex justify-between text-[11px] text-muted mb-1.5">
          <span>{xp_total} XP</span>
          <span>{xp_proximo} XP</span>
        </div>
        <div className="xp-bar-bg h-3">
          <div className="xp-bar-fill h-3" style={{ width: `${xpPercent}%` }} />
        </div>
        <p className="text-[11px] text-muted mt-1.5 text-center">
          Faltam {xp_proximo - xp_total} XP para o nível {nivel + 1}
        </p>
      </div>
    </div>
  );
}
