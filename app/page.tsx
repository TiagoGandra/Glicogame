"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ─── Types ──────────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  xp?: number;
  timestamp: string;
}

interface UserProfile {
  nome: string;
  nivel: number;
  xp_total: number;
  xp_proximo: number;
  streak_dias: number;
}

interface Mission {
  id: string;
  titulo: string;
  descricao: string;
  horario: string;
  status: "pendente" | "concluida";
  xp_recompensa: number;
}

interface Badge {
  slug: string;
  titulo: string;
  descricao: string;
  icone: string;
  unlocked: boolean;
}

interface GlucoseEntry {
  hora: string;
  valor: number;
}

type TabId = "chat" | "status" | "missoes" | "conquistas";

// ─── LocalStorage helpers ───────────────────────────────────────────
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(`glicogame_${key}`);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`glicogame_${key}`, JSON.stringify(value));
}

// ─── Constants ──────────────────────────────────────────────────────
const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
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

const DEFAULT_USER: UserProfile = {
  nome: "Paciente",
  nivel: 1,
  xp_total: 0,
  xp_proximo: 100,
  streak_dias: 0,
};

const DEFAULT_MISSIONS: Mission[] = [
  { id: "1", titulo: "Medir glicose em jejum", descricao: "Registre sua glicemia matinal", horario: "07:00", status: "pendente", xp_recompensa: 15 },
  { id: "2", titulo: "Tomar Glifage", descricao: "Metformina 850mg após o almoço", horario: "12:30", status: "pendente", xp_recompensa: 20 },
  { id: "3", titulo: "Registrar almoço", descricao: "Informe o que almoçou hoje", horario: "13:00", status: "pendente", xp_recompensa: 15 },
  { id: "4", titulo: "Tomar Glifage noturno", descricao: "Metformina 850mg após o jantar", horario: "20:00", status: "pendente", xp_recompensa: 20 },
  { id: "5", titulo: "Medir glicose noturna", descricao: "Registre sua glicemia antes de dormir", horario: "22:00", status: "pendente", xp_recompensa: 15 },
];

const DEFAULT_BADGES: Badge[] = [
  { slug: "primeira_medicao", titulo: "Primeira Medição", descricao: "Registrou a glicose pela primeira vez.", icone: "📊", unlocked: false },
  { slug: "streak_3", titulo: "Consistência Bronze", descricao: "Registrou dados por 3 dias seguidos.", icone: "🔥", unlocked: false },
  { slug: "streak_7", titulo: "Consistência Prata", descricao: "Registrou dados por 7 dias seguidos.", icone: "⚡", unlocked: false },
  { slug: "streak_30", titulo: "Consistência Ouro", descricao: "Registrou dados por 30 dias seguidos.", icone: "👑", unlocked: false },
  { slug: "alimentacao_saudavel", titulo: "Prato Consciente", descricao: "Registrou 10 refeições saudáveis.", icone: "🥗", unlocked: false },
  { slug: "remedio_em_dia", titulo: "Remédio em Dia", descricao: "Tomou todos os remédios por 7 dias.", icone: "💊", unlocked: false },
  { slug: "nivel_5", titulo: "Nível 5", descricao: "Alcançou o nível 5 de experiência.", icone: "⭐", unlocked: false },
  { slug: "nivel_10", titulo: "Nível 10", descricao: "Alcançou o nível 10 de experiência.", icone: "🌟", unlocked: false },
];

// ─── Glucose Chart Component ────────────────────────────────────────
function GlucoseChart({ data }: { data: GlucoseEntry[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted text-sm">
        Nenhuma medição registrada hoje. Use o chat para registrar.
      </div>
    );
  }

  const svgWidth = 320;
  const svgHeight = 160;
  const padding = { top: 20, right: 16, bottom: 30, left: 36 };
  const chartW = svgWidth - padding.left - padding.right;
  const chartH = svgHeight - padding.top - padding.bottom;

  const minVal = 60;
  const maxVal = 200;

  const points = data.map((d, i) => ({
    x: padding.left + (data.length === 1 ? chartW / 2 : (i / (data.length - 1)) * chartW),
    y: padding.top + chartH - ((d.valor - minVal) / (maxVal - minVal)) * chartH,
    valor: d.valor,
    hora: d.hora,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  const zoneTop = padding.top + chartH - ((140 - minVal) / (maxVal - minVal)) * chartH;
  const zoneBottom = padding.top + chartH - ((70 - minVal) / (maxVal - minVal)) * chartH;

  return (
    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={padding.left} y={zoneTop} width={chartW} height={zoneBottom - zoneTop} fill="var(--accent)" opacity="0.06" rx="4" />
      <text x={padding.left + 4} y={zoneTop + 12} fill="var(--muted)" fontSize="8" opacity="0.6">Meta</text>
      {[80, 100, 120, 140, 160, 180].map((v) => {
        const y = padding.top + chartH - ((v - minVal) / (maxVal - minVal)) * chartH;
        return (
          <g key={v}>
            <line x1={padding.left} y1={y} x2={padding.left + chartW} y2={y} className="chart-grid-line" />
            <text x={padding.left - 4} y={y + 3} textAnchor="end" fill="var(--muted)" fontSize="9">{v}</text>
          </g>
        );
      })}
      {points.map((p, i) => (
        <text key={i} x={p.x} y={svgHeight - 6} textAnchor="middle" fill="var(--muted)" fontSize="9">
          {data[i].hora}
        </text>
      ))}
      <path d={areaPath} className="chart-area" />
      <path d={linePath} className="chart-line" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" className="chart-dot" />
          <text x={p.x} y={p.y - 10} textAnchor="middle" fill="var(--accent-light)" fontSize="9" fontWeight="600">
            {p.valor}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ─── XP & Level-Up Logic ────────────────────────────────────────────
function calculateLevelUp(user: UserProfile, xpGained: number): UserProfile {
  let { xp_total, xp_proximo, nivel } = { ...user };
  xp_total += xpGained;

  while (xp_total >= xp_proximo) {
    xp_total -= xp_proximo;
    nivel += 1;
    xp_proximo += 50;
  }

  return { ...user, xp_total, xp_proximo, nivel };
}

// ─── Badge check logic ──────────────────────────────────────────────
function checkBadgeUnlocks(
  badges: Badge[],
  user: UserProfile,
  glucoseData: GlucoseEntry[],
  categorias?: string[]
): Badge[] {
  return badges.map((b) => {
    if (b.unlocked) return b;
    switch (b.slug) {
      case "primeira_medicao":
        return { ...b, unlocked: glucoseData.length > 0 || (categorias?.includes("glicose") ?? false) };
      case "streak_3":
        return { ...b, unlocked: user.streak_dias >= 3 };
      case "streak_7":
        return { ...b, unlocked: user.streak_dias >= 7 };
      case "streak_30":
        return { ...b, unlocked: user.streak_dias >= 30 };
      case "nivel_5":
        return { ...b, unlocked: user.nivel >= 5 };
      case "nivel_10":
        return { ...b, unlocked: user.nivel >= 10 };
      default:
        return b;
    }
  });
}

// ─── Main Page Component ────────────────────────────────────────────
export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("chat");
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [missions, setMissions] = useState<Mission[]>(DEFAULT_MISSIONS);
  const [badges, setBadges] = useState<Badge[]>(DEFAULT_BADGES);
  const [glucoseData, setGlucoseData] = useState<GlucoseEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ─── Load from localStorage on mount ────────────────────────────
  useEffect(() => {
    setUser(loadFromStorage("user", DEFAULT_USER));
    setMissions(loadFromStorage("missions", DEFAULT_MISSIONS));
    setBadges(loadFromStorage("badges", DEFAULT_BADGES));
    setGlucoseData(loadFromStorage("glucose", []));

    const storedMessages = loadFromStorage<ChatMessage[]>("messages", []);
    if (storedMessages.length === 0) {
      const welcomeMsg: ChatMessage = {
        id: "welcome",
        role: "assistant",
        content: "Olá! Sou seu assistente do Glicogame. Me conte como está sua saúde hoje — pode digitar algo como \"minha glicose tá 110\" ou \"tomei glifage agora\".",
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMsg]);
    } else {
      setMessages(storedMessages);
    }

    setMounted(true);
  }, []);

  // ─── Persist to localStorage on changes ─────────────────────────
  useEffect(() => {
    if (!mounted) return;
    saveToStorage("user", user);
  }, [user, mounted]);

  useEffect(() => {
    if (!mounted) return;
    saveToStorage("messages", messages);
  }, [messages, mounted]);

  useEffect(() => {
    if (!mounted) return;
    saveToStorage("missions", missions);
  }, [missions, mounted]);

  useEffect(() => {
    if (!mounted) return;
    saveToStorage("badges", badges);
  }, [badges, mounted]);

  useEffect(() => {
    if (!mounted) return;
    saveToStorage("glucose", glucoseData);
  }, [glucoseData, mounted]);

  // ─── Auto-scroll chat ──────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ─── Process AI response and update local state ─────────────────
  const processAIResponse = useCallback(
    (data: Record<string, unknown>) => {
      const xpGained = (data.xp_ganho as number) || 0;
      const categorias = (data.categorias as string[]) || [];
      const valorGlicose = data.valor_glicose as number | null;

      // Update XP + Level
      if (xpGained > 0) {
        setUser((prev) => {
          const updated = calculateLevelUp(prev, xpGained);
          return { ...updated, streak_dias: prev.streak_dias + (prev.streak_dias === 0 ? 1 : 0) };
        });
      }

      // Add glucose to chart
      if (valorGlicose && categorias.includes("glicose")) {
        const now = new Date();
        const hora = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }).replace(":", "h");
        setGlucoseData((prev) => {
          const updated = [...prev, { hora, valor: valorGlicose }];
          return updated.slice(-8); // Keep last 8 readings
        });
      }

      // Check badge unlocks
      setBadges((prev) =>
        checkBadgeUnlocks(prev, user, glucoseData, categorias)
      );
    },
    [user, glucoseData]
  );

  // ─── Send message to n8n webhook ────────────────────────────────
  const sendMessage = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

      if (!webhookUrl) {
        throw new Error("Webhook URL não configurada");
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }

      const data = await response.json();

      // Process gamification locally
      processAIResponse(data);

      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.feedback_paciente || "Registro salvo com sucesso!",
        xp: data.xp_ganho || 0,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      // Fallback demo mode
      const demoMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Modo demo: o webhook n8n não está conectado. Configure a variável NEXT_PUBLIC_N8N_WEBHOOK_URL no .env.local com a URL do seu webhook.",
        xp: 0,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, demoMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleMission = (id: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const newStatus = m.status === "pendente" ? "concluida" : "pendente";
        if (newStatus === "concluida") {
          setUser((u) => calculateLevelUp(u, m.xp_recompensa));
        }
        return { ...m, status: newStatus };
      })
    );
  };

  const clearChatHistory = () => {
    const welcomeMsg: ChatMessage = {
      id: "welcome",
      role: "assistant",
      content: "Histórico limpo. Me conte como está sua saúde hoje!",
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMsg]);
  };

  // ─── Derived values ────────────────────────────────────────────
  const xpPercent = user.xp_proximo > 0 ? Math.round((user.xp_total / user.xp_proximo) * 100) : 0;
  const completedMissions = missions.filter((m) => m.status === "concluida").length;
  const unlockedBadges = badges.filter((b) => b.unlocked).length;

  // ─── Prevent hydration mismatch ─────────────────────────────────
  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  // ─── RENDER ─────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-dvh max-w-md mx-auto w-full relative">
      {/* ── Header ────────────────────────────────────────────── */}
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
            <p className="text-xs font-semibold text-accent">{user.xp_total}/{user.xp_proximo}</p>
          </div>
          <div className="w-16">
            <div className="xp-bar-bg">
              <div className="xp-bar-fill" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </div>
      </header>

      {/* ── Content Area ──────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {/* ── Chat Tab ──────────────────────────────────────── */}
        {activeTab === "chat" && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                  style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}
                >
                  <div className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    {msg.xp != null && msg.xp > 0 && (
                      <p className="text-[11px] mt-1.5 text-accent font-semibold">+{msg.xp} XP</p>
                    )}
                    <p className="text-[10px] mt-1 opacity-40">
                      {new Date(msg.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="chat-bubble-ai">
                    <div className="flex gap-1.5 py-1">
                      <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* ── Chat Input ──────────────────────────────────── */}
            <div className="px-4 pb-2 pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ex: Minha glicose tá 110, tomei Glifage..."
                  className="flex-1 bg-card border border-border rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                  disabled={isLoading}
                  id="chat-input"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="send-button"
                  id="send-button"
                  aria-label="Enviar mensagem"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
              <div className="flex justify-center mt-1.5">
                <button onClick={clearChatHistory} className="text-[10px] text-muted hover:text-foreground transition-colors">
                  Limpar histórico
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Status Tab ────────────────────────────────────── */}
        {activeTab === "status" && (
          <div className="px-4 py-4 space-y-4 animate-fade-in">
            {/* Level Card */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider font-medium">Nível Atual</p>
                  <p className="text-3xl font-bold text-accent mt-1">{user.nivel}</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-dark to-accent flex items-center justify-center animate-pulse-glow">
                  <span className="text-2xl font-bold text-white">{user.nivel}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-muted mb-1.5">
                  <span>{user.xp_total} XP</span>
                  <span>{user.xp_proximo} XP</span>
                </div>
                <div className="xp-bar-bg h-3">
                  <div className="xp-bar-fill h-3" style={{ width: `${xpPercent}%` }} />
                </div>
                <p className="text-[11px] text-muted mt-1.5 text-center">
                  Faltam {user.xp_proximo - user.xp_total} XP para o nível {user.nivel + 1}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="metric-card text-center">
                <p className="text-2xl font-bold text-accent">{user.streak_dias}</p>
                <p className="text-[10px] text-muted mt-0.5 uppercase tracking-wider">Dias seguidos</p>
              </div>
              <div className="metric-card text-center">
                <p className="text-2xl font-bold text-success">{completedMissions}</p>
                <p className="text-[10px] text-muted mt-0.5 uppercase tracking-wider">Missões hoje</p>
              </div>
              <div className="metric-card text-center">
                <p className="text-2xl font-bold text-warning">{unlockedBadges}</p>
                <p className="text-[10px] text-muted mt-0.5 uppercase tracking-wider">Conquistas</p>
              </div>
            </div>

            {/* Glucose Chart */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold">Glicose Hoje</h2>
                <span className="text-[11px] text-muted px-2 py-0.5 rounded-full bg-border/50">mg/dL</span>
              </div>
              <GlucoseChart data={glucoseData} />
              {glucoseData.length > 0 && (
                <div className="flex items-center gap-4 mt-3 text-[10px] text-muted">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-accent" /> Glicose
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-accent/20" /> Faixa alvo (70-140)
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Missões Tab ───────────────────────────────────── */}
        {activeTab === "missoes" && (
          <div className="px-4 py-4 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold">Missões do Dia</h2>
              <span className="text-xs text-muted">{completedMissions}/{missions.length} completas</span>
            </div>

            <div className="xp-bar-bg">
              <div
                className="xp-bar-fill"
                style={{ width: `${(completedMissions / missions.length) * 100}%` }}
              />
            </div>

            {missions.map((mission, i) => (
              <button
                key={mission.id}
                onClick={() => toggleMission(mission.id)}
                className={`mission-card w-full text-left animate-fade-in ${mission.status === "concluida" ? "completed" : ""}`}
                style={{ animationDelay: `${i * 60}ms` }}
                id={`mission-${mission.id}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      mission.status === "concluida"
                        ? "bg-success border-success"
                        : "border-muted"
                    }`}
                  >
                    {mission.status === "concluida" && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${mission.status === "concluida" ? "line-through text-muted" : ""}`}>
                      {mission.titulo}
                    </p>
                    <p className="text-xs text-muted mt-0.5">{mission.descricao}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[11px] text-muted">{mission.horario}</p>
                    <p className="text-[11px] font-semibold text-accent">+{mission.xp_recompensa} XP</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── Conquistas Tab ────────────────────────────────── */}
        {activeTab === "conquistas" && (
          <div className="px-4 py-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">Conquistas</h2>
              <span className="text-xs text-muted">{unlockedBadges}/{badges.length} desbloqueadas</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge, i) => (
                <div
                  key={badge.slug}
                  className={`badge-card animate-fade-in ${!badge.unlocked ? "locked" : ""}`}
                  style={{ animationDelay: `${i * 60}ms` }}
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
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── Bottom Tab Navigation ─────────────────────────────── */}
      <nav className="tab-nav px-2 pb-[env(safe-area-inset-bottom,8px)]" id="main-nav">
        <div className="flex justify-around">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button flex-1 ${activeTab === tab.id ? "active" : ""}`}
              id={`tab-${tab.id}`}
              aria-label={tab.label}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
