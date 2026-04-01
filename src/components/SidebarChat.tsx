import { useState, useRef, useEffect } from "react";
import { sendChat } from "../utils/chat";
import type { ChatMessage } from "../utils/chat";
import { allSpots } from "../data/spots";
import type { Spot } from "../data/spots";
import { isOpenNow, formatHoursForDay } from "../data/hours";

interface Props {
  onBack: () => void;
  onSpotClick: (spot: Spot) => void;
}

const SUGGESTIONS = [
  "What should I order at DAMO?",
  "Which Erewhon has the best parking?",
  "Best matcha spot for working on a laptop?",
  "Compare Maru Coffee and Stereoscope",
  "What's the In-N-Out secret menu?",
  "Best stop near Silver Lake?",
];

function spotEmoji(type: string): string {
  return type === "matcha" ? "🍵" : type === "erewhon" ? "🥤" : "🍔";
}

function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.3 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}

// Match spot names mentioned in a response against our data
// Location keywords to match specific spots from response text
const LOCATION_KEYWORDS: { keyword: string; spotName: string }[] = [
  // Erewhon locations
  { keyword: "culver city", spotName: "Erewhon (Culver City)" },
  { keyword: "silver lake", spotName: "Erewhon (Silver Lake)" },
  { keyword: "venice", spotName: "Erewhon (Venice)" },
  { keyword: "santa monica", spotName: "Erewhon (Santa Monica)" },
  { keyword: "calabasas", spotName: "Erewhon (Calabasas)" },
  { keyword: "beverly hills", spotName: "Erewhon (Beverly Hills)" },
  { keyword: "studio city", spotName: "Erewhon (Studio City)" },
  { keyword: "pasadena", spotName: "Erewhon (Pasadena)" },
  { keyword: "manhattan beach", spotName: "Erewhon (Manhattan Beach)" },
  { keyword: "west hollywood", spotName: "Erewhon (West Hollywood)" },
  { keyword: "weho", spotName: "Erewhon (West Hollywood)" },
  { keyword: "glendale", spotName: "Erewhon (Glendale)" },
  { keyword: "fairfax", spotName: "Erewhon (Grove / Fairfax)" },
  { keyword: "grove", spotName: "Erewhon (Grove / Fairfax)" },
  // Matcha — specific locations
  { keyword: "koreatown", spotName: "DAMO (Koreatown)" },
  { keyword: "arts district", spotName: "DAMO (Arts District)" },
  { keyword: "echo park", spotName: "Stereoscope Coffee (Echo Park)" },
  { keyword: "long beach", spotName: "Stereoscope Coffee (Long Beach)" },
  { keyword: "los feliz", spotName: "Maru Coffee (Los Feliz)" },
  { keyword: "edinburgh", spotName: "Community Goods (Edinburgh Ave)" },
  { keyword: "pacific design", spotName: "Community Goods (Pacific Design Center)" },
];

function findMentionedSpots(text: string): Spot[] {
  const found: Spot[] = [];
  const seen = new Set<string>();
  const lower = text.toLowerCase();

  // First pass: exact full name match (case-insensitive)
  for (const spot of allSpots) {
    if (spot.type === "innout") continue;
    const key = `${spot.lng},${spot.lat}`;
    if (seen.has(key)) continue;
    if (lower.includes(spot.name.toLowerCase())) {
      found.push(spot);
      seen.add(key);
    }
  }

  // Second pass: match by brand + location keyword
  // e.g. "Culver City" in text + "erewhon" in text → Erewhon (Culver City)
  for (const { keyword, spotName } of LOCATION_KEYWORDS) {
    if (!lower.includes(keyword)) continue;
    const spot = allSpots.find((s) => s.name === spotName);
    if (spot && !seen.has(`${spot.lng},${spot.lat}`)) {
      // Only add if the brand is also mentioned
      const brandInText = lower.includes(spot.brand.toLowerCase()) ||
        lower.includes(spot.type);
      if (brandInText) {
        found.push(spot);
        seen.add(`${spot.lng},${spot.lat}`);
      }
    }
  }

  // Third pass: brand-only match for single-location brands
  const singleLocationBrands: Record<string, string> = {
    "memorylook": "Memorylook",
    "stagger": "Stagger Coffee",
    "kettl": "Kettl Tea (Los Feliz)",
    "archives of us": "Archives Of Us",
  };

  for (const [keyword, spotName] of Object.entries(singleLocationBrands)) {
    if (!lower.includes(keyword)) continue;
    const spot = allSpots.find((s) => s.name === spotName);
    if (spot && !seen.has(`${spot.lng},${spot.lat}`)) {
      found.push(spot);
      seen.add(`${spot.lng},${spot.lat}`);
    }
  }

  return found;
}

function SpotCard({ spot, onClick }: { spot: Spot; onClick: () => void }) {
  const now = new Date();
  const open = isOpenNow(spot.name, spot.type, now);
  const hours = formatHoursForDay(spot.name, spot.type, now);

  return (
    <div className="sidebar-chat-spot-card" onClick={onClick}>
      <span className="spot-icon">{spotEmoji(spot.type)}</span>
      <div className="spot-info">
        <strong>{spot.name}</strong>
        <span className="stars-row">
          <span className="stars-filled">{renderStars(spot.rating)}</span>
          <span className="stars-rating">{spot.rating}</span>
          <span className="stars-count">({spot.reviewCount.toLocaleString()})</span>
        </span>
        <small>{spot.address}</small>
        <small className={`hours-tag ${open ? "open" : "closed"}`}>
          {open ? "Open now" : "Closed"} · {hours}
        </small>
      </div>
    </div>
  );
}

export default function SidebarChat({ onBack, onSpotClick }: Props) {
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
    <div className="sidebar-chat">
      <button className="sidebar-chat-back" onClick={onBack}>
        ← Back to map
      </button>

      <div className="sidebar-chat-input-top">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about these spots..."
          className="sidebar-chat-input"
          disabled={loading}
        />
        {input.trim() && (
          <button
            className="sidebar-chat-send"
            onClick={() => handleSend()}
            disabled={loading}
          >
            →
          </button>
        )}
      </div>

      <div className="sidebar-chat-body">
        {messages.length === 0 && (
          <div className="sidebar-chat-welcome">
            <p className="sidebar-chat-welcome-text">Try asking:</p>
            <div className="sidebar-chat-suggestions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="sidebar-chat-suggestion"
                  onClick={() => handleSend(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          if (msg.role === "user") {
            return (
              <div key={i} className="sidebar-chat-msg user">
                <p className="sidebar-chat-question">{msg.content}</p>
              </div>
            );
          }

          const mentionedSpots = findMentionedSpots(msg.content);

          return (
            <div key={i} className="sidebar-chat-msg assistant">
              <p className="sidebar-chat-answer">{msg.content}</p>
              {mentionedSpots.length > 0 && (
                <div className="sidebar-chat-spots">
                  {mentionedSpots.map((spot) => (
                    <SpotCard
                      key={`${spot.lng},${spot.lat}`}
                      spot={spot}
                      onClick={() => onSpotClick(spot)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="sidebar-chat-msg assistant">
            <div className="sidebar-chat-typing">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
