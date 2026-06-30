interface StatsGridProps {
  streakDias: number;
  missoesConcluidas: number;
  conquistasDesbloqueadas: number;
}

export default function StatsGrid({
  streakDias,
  missoesConcluidas,
  conquistasDesbloqueadas,
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="metric-card text-center">
        <p className="text-2xl font-bold text-accent">{streakDias}</p>
        <p className="text-[10px] text-muted mt-0.5 uppercase tracking-wider">Dias seguidos</p>
      </div>
      <div className="metric-card text-center">
        <p className="text-2xl font-bold text-success">{missoesConcluidas}</p>
        <p className="text-[10px] text-muted mt-0.5 uppercase tracking-wider">Missões hoje</p>
      </div>
      <div className="metric-card text-center">
        <p className="text-2xl font-bold text-warning">{conquistasDesbloqueadas}</p>
        <p className="text-[10px] text-muted mt-0.5 uppercase tracking-wider">Conquistas</p>
      </div>
    </div>
  );
}
