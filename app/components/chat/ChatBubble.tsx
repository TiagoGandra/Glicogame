import type { ChatMessage } from "@/app/lib/types";

interface ChatBubbleProps {
  message: ChatMessage;
  animationDelay?: number;
}

export default function ChatBubble({ message, animationDelay = 0 }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className={isUser ? "chat-bubble-user" : "chat-bubble-ai"}>
        <p className="text-sm leading-relaxed">{message.content}</p>
        {message.xp != null && message.xp > 0 && (
          <p className="text-[11px] mt-1.5 text-accent font-semibold">+{message.xp} XP</p>
        )}
        <p className="text-[10px] mt-1 opacity-40">
          {new Date(message.timestamp).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
