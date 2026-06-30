"use client";

import { useState } from "react";
import type { RankingPlayer } from "@/app/lib/types";
import { MOCK_RANKING_PLAYERS } from "@/app/lib/constants";
import RankingPodium from "./RankingPodium";
import RankingRow from "./RankingRow";

type Period = "semana" | "mes" | "geral";

const PERIOD_LABELS: Record<Period, string> = {
  semana: "Esta semana",
  mes: "Este mês",
  geral: "Geral",
};

// Slightly vary mock data per period to make demo feel real
function getPlayersForPeriod(period: Period): RankingPlayer[] {
  if (period === "semana") return MOCK_RANKING_PLAYERS;

  if (period === "mes") {
    return MOCK_RANKING_PLAYERS.map((p, i) => ({
      ...p,
      xp_semana: Math.round(p.xp_semana * 4.2),
      missoes_semana: Math.round(p.missoes_semana * 4.2),
    }));
  }

  // Geral — reorder slightly and scale up
  const reordered = [...MOCK_RANKING_PLAYERS];
  [reordered[1], reordered[2]] = [reordered[2], reordered[1]];
  return reordered.map((p) => ({
    ...p,
    xp_semana: Math.round(p.xp_semana * 18),
    missoes_semana: Math.round(p.missoes_semana * 18),
    variacao: "same" as const,
  }));
}

export default function RankingTab() {
  const [period, setPeriod] = useState<Period>("semana");

  const players = getPlayersForPeriod(period);
  const top3 = players.slice(0, 3);
  const rest = players.slice(3);
  const myPosition = players.findIndex((p) => p.isCurrentUser) + 1;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* ── "Coming soon" banner ───────────────────────────────── */}
      <div className="mx-4 mt-4 mb-2 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-accent/30 bg-accent/5">
        <span className="text-lg flex-shrink-0">🚀</span>
        <div>
          <p className="text-[11px] font-semibold text-accent">Funcionalidade em desenvolvimento</p>
          <p className="text-[10px] text-muted leading-relaxed">
            O ranking online exigirá conta e sincronização em nuvem. Preview para demonstração.
          </p>
        </div>
      </div>

      {/* ── Period selector ────────────────────────────────────── */}
      <div className="flex gap-1.5 px-4 mb-1">
        {(["semana", "mes", "geral"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 text-[11px] font-semibold py-2 rounded-lg transition-all duration-200
              ${period === p
                ? "bg-accent text-white shadow-[0_0_12px_rgba(20,184,166,0.3)]"
                : "bg-card border border-border text-muted hover:text-foreground"
              }`}
            id={`ranking-period-${p}`}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ── League header ──────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-2">
          <div>
            <p className="text-[11px] text-muted uppercase tracking-wider">Liga Diamante</p>
            <p className="text-xs text-foreground font-semibold">Grupo dos Campeões • 128 pacientes</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted">Sua posição</p>
            <p className="text-lg font-bold text-accent">#{myPosition}</p>
          </div>
        </div>

        {/* ── Podium ─────────────────────────────────────────────── */}
        <RankingPodium top3={top3} />

        {/* ── Divider ────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] text-muted uppercase tracking-widest">Classificação completa</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* ── Rest of ranking ────────────────────────────────────── */}
        <div className="px-4 pb-4 space-y-2">
          {rest.map((player, i) => (
            <RankingRow
              key={player.id}
              player={player}
              position={i + 4}
              animationDelay={i * 60}
            />
          ))}
        </div>

        {/* ── My stats card ──────────────────────────────────────── */}
        <div className="mx-4 mb-4 p-4 rounded-xl border border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
          <p className="text-[11px] text-accent font-semibold uppercase tracking-wider mb-3">
            Suas estatísticas da semana
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "XP ganhos", value: "0", icon: "⚡" },
              { label: "Missões", value: "0/35", icon: "✅" },
              { label: "Streak", value: "0 dias", icon: "🔥" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-base">{stat.icon}</p>
                <p className="text-sm font-bold text-foreground mt-0.5">{stat.value}</p>
                <p className="text-[9px] text-muted mt-0.5 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted text-center mt-3 leading-relaxed">
            Complete missões diárias para subir no ranking e competir com outros pacientes! 💪
          </p>
        </div>

        {/* ── Future features teaser ─────────────────────────────── */}
        <div className="mx-4 mb-6 space-y-2">
          <p className="text-[10px] text-muted uppercase tracking-wider px-1 mb-2">
            Próximas funcionalidades
          </p>
          {[
            { icon: "🏆", title: "Ligas semanais", desc: "Suba de Bronze a Diamante competindo com grupos de pacientes similares" },
            { icon: "👥", title: "Grupos de apoio", desc: "Crie times com família e amigos para se motivarem juntos" },
            { icon: "🎯", title: "Desafios globais", desc: "Participe de eventos especiais com recompensas exclusivas" },
          ].map((feat) => (
            <div
              key={feat.title}
              className="flex gap-3 p-3 rounded-xl border border-border/50 bg-card/30"
            >
              <span className="text-xl flex-shrink-0">{feat.icon}</span>
              <div>
                <p className="text-xs font-semibold flex items-center gap-2">
                  {feat.title}
                  <span className="text-[8px] bg-accent/15 text-accent px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    Em breve
                  </span>
                </p>
                <p className="text-[10px] text-muted mt-0.5 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
