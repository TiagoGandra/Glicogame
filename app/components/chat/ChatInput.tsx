import { useRef } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onClear: () => void;
  isLoading: boolean;
}

export default function ChatInput({ value, onChange, onSend, onClear, isLoading }: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="px-4 pb-2 pt-2 border-t border-border">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ex: Minha glicose tá 110, tomei Glifage..."
          className="flex-1 bg-card border border-border rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
          disabled={isLoading}
          id="chat-input"
        />
        <button
          onClick={onSend}
          disabled={!value.trim() || isLoading}
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
        <button
          onClick={onClear}
          className="text-[10px] text-muted hover:text-foreground transition-colors"
        >
          Limpar histórico
        </button>
      </div>
    </div>
  );
}
