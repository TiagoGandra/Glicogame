import type { UserProfile } from "@/app/lib/types";

interface AppHeaderProps {
  user: UserProfile;
  xpPercent: number;
}

export default function AppHeader({ user, xpPercent }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-border">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-dark to-accent flex items-center justify-center text-white font-bold text-sm">
          G
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight">Glicogame</h1>
          <p className="text-[11px] text-muted">
            Nível {user.nivel} · {user.streak_dias} dia{user.streak_dias !== 1 ? "s" : ""} seguido{user.streak_dias !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right">
          <p className="text-[11px] text-muted">XP</p>
          <p className="text-xs font-semibold text-accent">
            {user.xp_total}/{user.xp_proximo}
          </p>
        </div>
        <div className="w-16">
          <div className="xp-bar-bg">
            <div className="xp-bar-fill" style={{ width: `${xpPercent}%` }} />
          </div>
        </div>
      </div>
    </header>
  );
}
