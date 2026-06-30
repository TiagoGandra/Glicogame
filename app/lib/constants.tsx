import React from "react";
import type { Mission, Badge, UserProfile, TabId } from "./types";

export const DEFAULT_USER: UserProfile = {
  nome: "Paciente",
  nivel: 1,
  xp_total: 0,
  xp_proximo: 100,
  streak_dias: 0,
};

export const DEFAULT_MISSIONS: Mission[] = [
  { id: "1", titulo: "Medir glicose em jejum", descricao: "Registre sua glicemia matinal", horario: "07:00", status: "pendente", xp_recompensa: 15 },
  { id: "2", titulo: "Tomar Glifage", descricao: "Metformina 850mg após o almoço", horario: "12:30", status: "pendente", xp_recompensa: 20 },
  { id: "3", titulo: "Registrar almoço", descricao: "Informe o que almoçou hoje", horario: "13:00", status: "pendente", xp_recompensa: 15 },
  { id: "4", titulo: "Tomar Glifage noturno", descricao: "Metformina 850mg após o jantar", horario: "20:00", status: "pendente", xp_recompensa: 20 },
  { id: "5", titulo: "Medir glicose noturna", descricao: "Registre sua glicemia antes de dormir", horario: "22:00", status: "pendente", xp_recompensa: 15 },
];

export const DEFAULT_BADGES: Badge[] = [
  { slug: "primeira_medicao", titulo: "Primeira Medição", descricao: "Registrou a glicose pela primeira vez.", icone: "📊", unlocked: false },
  { slug: "streak_3", titulo: "Consistência Bronze", descricao: "Registrou dados por 3 dias seguidos.", icone: "🔥", unlocked: false },
  { slug: "streak_7", titulo: "Consistência Prata", descricao: "Registrou dados por 7 dias seguidos.", icone: "⚡", unlocked: false },
  { slug: "streak_30", titulo: "Consistência Ouro", descricao: "Registrou dados por 30 dias seguidos.", icone: "👑", unlocked: false },
  { slug: "alimentacao_saudavel", titulo: "Prato Consciente", descricao: "Registrou 10 refeições saudáveis.", icone: "🥗", unlocked: false },
  { slug: "remedio_em_dia", titulo: "Remédio em Dia", descricao: "Tomou todos os remédios por 7 dias.", icone: "💊", unlocked: false },
  { slug: "nivel_5", titulo: "Nível 5", descricao: "Alcançou o nível 5 de experiência.", icone: "⭐", unlocked: false },
  { slug: "nivel_10", titulo: "Nível 10", descricao: "Alcançou o nível 10 de experiência.", icone: "🌟", unlocked: false },
];

export const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  {
    id: "chat",
    label: "Chat",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "status",
    label: "Status",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    id: "missoes",
    label: "Missões",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    id: "conquistas",
    label: "Conquistas",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
  },
];
