import { matchaProfiles } from "../data/matcha-profiles";
import { erewhonProfiles } from "../data/erewhon-profiles";
import { allSpots } from "../data/spots";

const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY as string;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function buildSystemPrompt(): string {
  const matchaInfo = Object.entries(matchaProfiles)
    .map(([name, p]) => {
      const spot = allSpots.find((s) => s.name === name);
      return `${name}: ${p.tagline}. Founded ${p.founded} by ${p.founders}. ${spot?.address}. Rating ${spot?.rating}. Vibe: ${p.vibe.slice(0, 120)}. Top items: ${p.menu.slice(0, 3).map((m) => m.name).join(", ")}. Tip: ${p.tip}`;
    })
    .join("\n");

  const erewhonInfo = Object.entries(erewhonProfiles)
    .map(([name, p]) => {
      const spot = allSpots.find((s) => s.name === name);
      return `${name}: ${p.highlight}. Opened ${p.opened}. ${spot?.address}. Rating ${spot?.rating}. Vibe: ${p.vibe.slice(0, 120)}. Known for: ${p.menu.slice(0, 3).map((m) => m.name).join(", ")}. Tip: ${p.tip}`;
    })
    .join("\n");

  return `You are a friendly LA food guide for the "Somewhere in LA" app. You know matcha shops, In-N-Outs, and Erewhons in LA. Keep responses to 2-4 sentences. Be direct, specific, conversational. No markdown. Always use the exact spot name (e.g. "Erewhon (Culver City)" not just "Culver City Erewhon") so the app can link to it.

MATCHA SHOPS:
${matchaInfo}

EREWHON MARKETS:
${erewhonInfo}

IN-N-OUT: 63 locations across SoCal. Known for Double-Double, Animal Style Fries, Neapolitan Shake, secret menu (4x4, Protein Style, grilled cheese). Founded 1948. Never frozen, no microwaves.`;
}

const systemPrompt = buildSystemPrompt();

export async function sendChat(
  messages: ChatMessage[]
): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.href,
      "X-Title": "Somewhere in LA",
    },
    body: JSON.stringify({
      model: "anthropic/claude-3.5-haiku",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 350,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("[Chat API error]", res.status, data);
    throw new Error(`Chat API error: ${res.status}`);
  }

  return data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
}
