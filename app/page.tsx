"use client";

import { useState, useEffect, useCallback } from "react";
import type { ChatMessage, UserProfile, Mission, Badge, GlucoseEntry, TabId } from "@/app/lib/types";
import { DEFAULT_USER, DEFAULT_MISSIONS, DEFAULT_BADGES } from "@/app/lib/constants";
import { loadFromStorage, saveToStorage } from "@/app/lib/storage";
import { calculateLevelUp, checkBadgeUnlocks } from "@/app/lib/game-logic";
import AppHeader from "@/app/components/layout/AppHeader";
import TabNavigation from "@/app/components/layout/TabNavigation";
import ChatTab from "@/app/components/chat/ChatTab";
import StatusTab from "@/app/components/status/StatusTab";
import MissionsTab from "@/app/components/missions/MissionsTab";
import BadgesTab from "@/app/components/badges/BadgesTab";
import RankingTab from "@/app/components/ranking/RankingTab";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Olá! Sou seu assistente do Glicogame. Me conte como está sua saúde hoje — pode digitar algo como \"minha glicose tá 110\" ou \"tomei glifage agora\".",
  timestamp: new Date().toISOString(),
};

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

  // ── Load from localStorage on mount ────────────────────────────────
  useEffect(() => {
    setUser(loadFromStorage("user", DEFAULT_USER));
    setMissions(loadFromStorage("missions", DEFAULT_MISSIONS));
    setBadges(loadFromStorage("badges", DEFAULT_BADGES));
    setGlucoseData(loadFromStorage("glucose", []));

    const storedMessages = loadFromStorage<ChatMessage[]>("messages", []);
    setMessages(storedMessages.length === 0 ? [WELCOME_MESSAGE] : storedMessages);

    setMounted(true);
  }, []);

  // ── Persist to localStorage on state changes ────────────────────────
  useEffect(() => { if (mounted) saveToStorage("user", user); }, [user, mounted]);
  useEffect(() => { if (mounted) saveToStorage("messages", messages); }, [messages, mounted]);
  useEffect(() => { if (mounted) saveToStorage("missions", missions); }, [missions, mounted]);
  useEffect(() => { if (mounted) saveToStorage("badges", badges); }, [badges, mounted]);
  useEffect(() => { if (mounted) saveToStorage("glucose", glucoseData); }, [glucoseData, mounted]);

  // ── Process AI response and update gamification state ───────────────
  const processAIResponse = useCallback(
    (data: Record<string, unknown>) => {
      const xpGained = (data.xp_ganho as number) || 0;
      const categorias = (data.categorias as string[]) || [];
      const valorGlicose = data.valor_glicose as number | null;

      if (xpGained > 0) {
        setUser((prev) => {
          const updated = calculateLevelUp(prev, xpGained);
          return { ...updated, streak_dias: prev.streak_dias + (prev.streak_dias === 0 ? 1 : 0) };
        });
      }

      if (valorGlicose && categorias.includes("glicose")) {
        const hora = new Date()
          .toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
          .replace(":", "h");
        setGlucoseData((prev) => [...prev, { hora, valor: valorGlicose }].slice(-8));
      }

      setBadges((prev) => checkBadgeUnlocks(prev, user, glucoseData, categorias));
    },
    [user, glucoseData]
  );

  // ── Send message to n8n webhook ─────────────────────────────────────
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
      if (!webhookUrl) throw new Error("Webhook URL não configurada");

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, timestamp: new Date().toISOString() }),
      });

      if (!response.ok) throw new Error(`Erro ${response.status}`);

      const data = await response.json();
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
      const demoMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Modo demo: o webhook n8n não está conectado. Configure a variável NEXT_PUBLIC_N8N_WEBHOOK_URL no .env.local com a URL do seu webhook.",
        xp: 0,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, demoMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Mission toggle ──────────────────────────────────────────────────
  const toggleMission = (id: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const newStatus = m.status === "pendente" ? "concluida" : "pendente";
        if (newStatus === "concluida") setUser((u) => calculateLevelUp(u, m.xp_recompensa));
        return { ...m, status: newStatus };
      })
    );
  };

  // ── Clear chat ──────────────────────────────────────────────────────
  const clearChatHistory = () => {
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: "Histórico limpo. Me conte como está sua saúde hoje!",
      timestamp: new Date().toISOString(),
    }]);
  };

  // ── Derived values ──────────────────────────────────────────────────
  const xpPercent = user.xp_proximo > 0 ? Math.round((user.xp_total / user.xp_proximo) * 100) : 0;
  const completedMissions = missions.filter((m) => m.status === "concluida").length;
  const unlockedBadges = badges.filter((b) => b.unlocked).length;

  // ── Hydration guard ─────────────────────────────────────────────────
  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh max-w-md mx-auto w-full relative">
      <AppHeader user={user} xpPercent={xpPercent} />

      <main className="flex-1 overflow-y-auto">
        {activeTab === "chat" && (
          <ChatTab
            messages={messages}
            inputValue={inputValue}
            isLoading={isLoading}
            onInputChange={setInputValue}
            onSend={sendMessage}
            onClear={clearChatHistory}
          />
        )}
        {activeTab === "status" && (
          <StatusTab
            user={user}
            xpPercent={xpPercent}
            glucoseData={glucoseData}
            completedMissions={completedMissions}
            unlockedBadges={unlockedBadges}
          />
        )}
        {activeTab === "missoes" && (
          <MissionsTab
            missions={missions}
            completedMissions={completedMissions}
            onToggleMission={toggleMission}
          />
        )}
        {activeTab === "conquistas" && (
          <BadgesTab
            badges={badges}
            unlockedBadges={unlockedBadges}
          />
        )}
        {activeTab === "ranking" && <RankingTab />}
      </main>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
