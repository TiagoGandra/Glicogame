export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  xp?: number;
  timestamp: string;
}

export interface UserProfile {
  nome: string;
  nivel: number;
  xp_total: number;
  xp_proximo: number;
  streak_dias: number;
}

export interface Mission {
  id: string;
  titulo: string;
  descricao: string;
  horario: string;
  status: "pendente" | "concluida";
  xp_recompensa: number;
}

export interface Badge {
  slug: string;
  titulo: string;
  descricao: string;
  icone: string;
  unlocked: boolean;
}

export interface GlucoseEntry {
  hora: string;
  valor: number;
}

export type TabId = "chat" | "status" | "missoes" | "conquistas" | "ranking";

export interface RankingPlayer {
  id: string;
  nome: string;
  avatar: string;
  nivel: number;
  xp_semana: number;
  streak_dias: number;
  missoes_semana: number;
  isCurrentUser?: boolean;
  variacao: "up" | "down" | "same" | "new";
  posicao_anterior: number;
}
