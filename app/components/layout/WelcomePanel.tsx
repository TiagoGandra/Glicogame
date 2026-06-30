"use client";

import { useEffect, useState } from "react";

const MOTIVATIONAL_PHRASES = [
  "Cada registro é um passo rumo ao seu melhor controle glicêmico. 💪",
  "Consistência é o segredo: pequenos hábitos, grandes resultados. 🌱",
  "Você já está na frente de quem nem começou. Continue! 🚀",
  "Registrar hoje é cuidar do seu amanhã. ❤️",
  "Seu histórico é seu superpoder — use-o com sabedoria. ⚡",
  "A jornada de mil milhas começa com um único registro. 🎯",
];

export default function WelcomePanel() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setPhraseIndex((i) => (i + 1) % MOTIVATIONAL_PHRASES.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-10 py-12 text-center select-none">
      {/* Logo / ícone principal */}
      <div className="relative mb-8">
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-3xl bg-accent/20 blur-2xl scale-125" />
        <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-accent-dark via-accent to-cyan-400 flex items-center justify-center shadow-[0_0_48px_rgba(20,184,166,0.4)] animate-pulse-glow">
          <span className="text-5xl font-black text-white tracking-tighter drop-shadow-lg">G</span>
        </div>
        {/* Badge de nível */}
        <div className="absolute -bottom-3 -right-3 w-9 h-9 rounded-full bg-gradient-to-br from-warning to-orange-400 flex items-center justify-center shadow-lg border-2 border-background">
          <span className="text-sm">🎮</span>
        </div>
      </div>

      {/* Nome do app */}
      <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-accent-light via-cyan-300 to-accent bg-clip-text text-transparent mb-1">
        Glicogame
      </h2>
      <p className="text-xs font-semibold text-muted uppercase tracking-[0.2em] mb-6">
        Saúde que vira jogo
      </p>

      {/* Descrição */}
      <p className="text-sm text-muted leading-relaxed max-w-xs mb-10">
        Registre sua glicose, medicamentos e hábitos pelo chat. Ganhe{" "}
        <span className="text-accent font-semibold">XP</span>, suba de nível e complete{" "}
        <span className="text-success font-semibold">missões diárias</span> enquanto cuida da sua saúde.
      </p>

      {/* Frase motivacional rotativa */}
      <div className="w-full max-w-sm px-5 py-4 rounded-2xl border border-accent/20 bg-accent/5 min-h-[88px] flex items-center justify-center">
        <p
          className="text-sm text-foreground/80 leading-relaxed italic transition-opacity duration-400"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {MOTIVATIONAL_PHRASES[phraseIndex]}
        </p>
      </div>

      {/* Indicadores de frase */}
      <div className="flex gap-1.5 mt-4">
        {MOTIVATIONAL_PHRASES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setPhraseIndex(i); setVisible(true); }}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === phraseIndex ? "bg-accent w-4" : "bg-border hover:bg-muted"
            }`}
            aria-label={`Frase ${i + 1}`}
          />
        ))}
      </div>

      {/* Dica de uso */}
      <div className="mt-10 flex items-center gap-2 text-[11px] text-muted">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Use o chat ao lado para começar a registrar
      </div>
    </div>
  );
}
