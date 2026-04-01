import { useState, useRef, useEffect } from "react";
import { sendChat } from "../utils/chat";
import type { ChatMessage } from "../utils/chat";

interface Props {
  onClose: () => void;
}

const SUGGESTIONS = [
  "What should I order at DAMO?",
  "Which Erewhon has the best parking?",
  "Best matcha spot for working on a laptop?",
  "Compare Maru Coffee and Stereoscope",
  "What's the In-N-Out secret menu?",
  "Best stop near Silver Lake?",
];

export default function SpotChat({ onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg || loading) return;

    const userMsg: ChatMessage = { role: "user", content: msg };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendChat(updated);
      setMessages([...updated, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...updated,
        { role: "assistant", content: "Sorry, something went wrong. Try again?" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div>
          <h3 className="chat-title">Ask about any spot</h3>
          <p className="chat-subtitle">I know every matcha shop, Erewhon, and In-N-Out in LA</p>
        </div>
        <button className="chat-close" onClick={onClose}>
          &times;
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-welcome">
            <p className="chat-welcome-text">Try asking me something:</p>
            <div className="chat-suggestions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="chat-suggestion"
                  onClick={() => handleSend(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.role}`}>
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="chat-bubble assistant chat-typing">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="chat-input-row">
        <input
          ref={inputRef}
          className="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          disabled={loading}
        />
        <button
          className="chat-send"
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
        >
          &uarr;
        </button>
      </div>
    </div>
  );
}
