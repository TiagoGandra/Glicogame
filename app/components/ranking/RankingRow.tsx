import type { RankingPlayer } from "@/app/lib/types";

interface RankingRowProps {
  player: RankingPlayer;
  position: number;
  animationDelay?: number;
}

const VARIACAO_CONFIG = {
  up: { icon: "↑", color: "text-success", label: "subiu" },
  down: { icon: "↓", color: "text-danger", label: "caiu" },
  same: { icon: "—", color: "text-muted", label: "mesmo" },
  new: { icon: "★", color: "text-accent", label: "novo" },
} as const;

export default function RankingRow({ player, position, animationDelay = 0 }: RankingRowProps) {
  const variacao = VARIACAO_CONFIG[player.variacao];
  const isTop3 = position <= 3;

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 animate-fade-in
        ${player.isCurrentUser
          ? "border-accent/50 bg-accent/5 shadow-[0_0_16px_rgba(20,184,166,0.08)]"
          : "border-border bg-card/60 hover:border-border hover:bg-card"
        }
      `}
      style={{ animationDelay: `${animationDelay}ms` }}
      id={`ranking-player-${player.id}`}
    >
      {/* Position */}
      <div className="w-7 flex-shrink-0 text-center">
        {isTop3 ? (
          <span className="text-base">{["🥇", "🥈", "🥉"][position - 1]}</span>
        ) : (
          <span className={`text-sm font-bold ${player.isCurrentUser ? "text-accent" : "text-muted"}`}>
            {position}
          </span>
        )}
      </div>

      {/* Avatar */}
      <div
        className={`
          w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0
          ${player.isCurrentUser ? "bg-accent/20 border border-accent/30" : "bg-border/40"}
        `}
      >
        {player.avatar}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className={`text-sm font-semibold truncate ${player.isCurrentUser ? "text-accent" : "text-foreground"}`}>
            {player.nome}
          </p>
          {player.isCurrentUser && (
            <span className="text-[9px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider flex-shrink-0">
              Você
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-muted">Nv. {player.nivel}</span>
          <span className="text-[10px] text-muted">·</span>
          <span className="text-[10px] text-muted">🔥 {player.streak_dias}d</span>
          <span className="text-[10px] text-muted">·</span>
          <span className="text-[10px] text-muted">{player.missoes_semana} missões</span>
        </div>
      </div>

      {/* XP + variação */}
      <div className="text-right flex-shrink-0">
        <p className={`text-sm font-bold ${player.isCurrentUser ? "text-accent" : "text-foreground"}`}>
          {player.xp_semana.toLocaleString("pt-BR")}
        </p>
        <p className={`text-[10px] font-semibold ${variacao.color}`}>
          {variacao.icon} {player.variacao === "new" ? "novato" : player.variacao === "same" ? "estável" : `${Math.abs(player.posicao_anterior - position)}º`}
        </p>
      </div>
    </div>
  );
}
