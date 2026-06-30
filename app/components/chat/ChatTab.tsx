"use client";

import { useRef, useEffect } from "react";
import type { ChatMessage } from "@/app/lib/types";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";

interface ChatTabProps {
  messages: ChatMessage[];
  inputValue: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onClear: () => void;
}

export default function ChatTab({
  messages,
  inputValue,
  isLoading,
  onInputChange,
  onSend,
  onClear,
}: ChatTabProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            animationDelay={Math.min(i * 50, 300)}
          />
        ))}

        {isLoading && <TypingIndicator />}

        <div ref={chatEndRef} />
      </div>

      <ChatInput
        value={inputValue}
        onChange={onInputChange}
        onSend={onSend}
        onClear={onClear}
        isLoading={isLoading}
      />
    </div>
  );
}
