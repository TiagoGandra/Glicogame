import type { RankingPlayer } from "@/app/lib/types";

interface PodiumSlotProps {
  player: RankingPlayer;
  position: 1 | 2 | 3;
}

const POSITION_CONFIG = {
  1: {
    height: "h-24",
    gradient: "from-yellow-500/30 to-yellow-400/10",
    border: "border-yellow-500/50",
    crown: "👑",
    medal: "🥇",
    textColor: "text-yellow-400",
    zIndex: "z-10",
    avatarSize: "w-16 h-16 text-3xl",
    order: "order-2",
    marginTop: "-mt-4",
  },
  2: {
    height: "h-16",
    gradient: "from-slate-400/20 to-slate-300/5",
    border: "border-slate-400/40",
    crown: "",
    medal: "🥈",
    textColor: "text-slate-300",
    zIndex: "z-0",
    avatarSize: "w-13 h-13 text-2xl",
    order: "order-1",
    marginTop: "mt-4",
  },
  3: {
    height: "h-12",
    gradient: "from-amber-700/20 to-amber-600/5",
    border: "border-amber-700/40",
    crown: "",
    medal: "🥉",
    textColor: "text-amber-500",
    zIndex: "z-0",
    avatarSize: "w-12 h-12 text-2xl",
    order: "order-3",
    marginTop: "mt-6",
  },
} as const;

function PodiumSlot({ player, position }: PodiumSlotProps) {
  const cfg = POSITION_CONFIG[position];

  return (
    <div className={`flex flex-col items-center gap-1.5 flex-1 ${cfg.order} ${cfg.marginTop}`}>
      {/* Crown (only #1) */}
      {cfg.crown && (
        <span className="text-lg animate-bounce" style={{ animationDuration: "2s" }}>
          {cfg.crown}
        </span>
      )}

      {/* Avatar */}
      <div
        className={`${cfg.avatarSize} rounded-2xl border-2 ${cfg.border} bg-gradient-to-br ${cfg.gradient}
          flex items-center justify-center relative backdrop-blur-sm`}
        style={{ width: position === 1 ? 64 : position === 2 ? 52 : 48, height: position === 1 ? 64 : position === 2 ? 52 : 48 }}
      >
        <span style={{ fontSize: position === 1 ? 28 : 22 }}>{player.avatar}</span>
        {player.isCurrentUser && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent rounded-full border-2 border-background" />
        )}
      </div>

      {/* Medal */}
      <span className="text-base">{cfg.medal}</span>

      {/* Name */}
      <p className="text-[11px] font-semibold text-center leading-tight max-w-[70px] truncate">
        {player.nome}
      </p>

      {/* XP */}
      <p className={`text-[10px] font-bold ${cfg.textColor}`}>
        {player.xp_semana.toLocaleString("pt-BR")} XP
      </p>

      {/* Pedestal */}
      <div
        className={`w-full rounded-t-lg border-t border-x ${cfg.border} bg-gradient-to-b ${cfg.gradient} ${cfg.height} mt-1`}
      />
    </div>
  );
}

interface RankingPodiumProps {
  top3: RankingPlayer[];
}

export default function RankingPodium({ top3 }: RankingPodiumProps) {
  const [first, second, third] = top3;

  return (
    <div className="flex items-end justify-center gap-2 px-4 pt-2 pb-0">
      {second && <PodiumSlot player={second} position={2} />}
      {first && <PodiumSlot player={first} position={1} />}
      {third && <PodiumSlot player={third} position={3} />}
    </div>
  );
}
