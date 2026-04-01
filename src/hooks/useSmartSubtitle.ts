import { useState, useEffect } from "react";
import { allSpots } from "../data/spots";
import { isOpenNow } from "../data/hours";

const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY as string;

// LA coordinates — always use LA weather
const LA_LAT = 34.05;
const LA_LNG = -118.25;

function getTimeContext(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "late night";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}

function getOpenCounts(): { matcha: number; erewhon: number; innout: number } {
  const now = new Date();
  let matcha = 0, erewhon = 0, innout = 0;
  for (const spot of allSpots) {
    if (isOpenNow(spot.name, spot.type, now)) {
      if (spot.type === "matcha") matcha++;
      else if (spot.type === "erewhon") erewhon++;
      else innout++;
    }
  }
  return { matcha, erewhon, innout };
}

async function getLAWeather(): Promise<{ temp: number; condition: string } | null> {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LA_LAT}&longitude=${LA_LNG}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`
    );
    const data = await res.json();
    const temp = Math.round(data.current.temperature_2m);
    const code = data.current.weather_code;

    // Map weather codes to simple descriptions
    let condition = "clear";
    if (code === 0) condition = "clear skies";
    else if (code <= 3) condition = "partly cloudy";
    else if (code <= 48) condition = "foggy";
    else if (code <= 67) condition = "rainy";
    else if (code <= 77) condition = "snowy";
    else if (code <= 99) condition = "stormy";

    return { temp, condition };
  } catch {
    return null;
  }
}

export function useSmartSubtitle(): string {
  const [subtitle, setSubtitle] = useState("find every in-n-out, matcha spot & erewhon on your drive");

  useEffect(() => {
    async function generate() {
      const timeContext = getTimeContext();
      const counts = getOpenCounts();
      const weather = await getLAWeather();

      const weatherLine = weather
        ? `The weather in LA right now: ${weather.temp}°F and ${weather.condition}.`
        : "";

      const prompt = `Generate a single short, warm, poetic subtitle (max 12 words) for a website called "Somewhere in LA" that helps people find matcha shops, In-N-Out, and Erewhon in Los Angeles. It's currently ${timeContext}. ${weatherLine} Right now ${counts.matcha} matcha spots, ${counts.erewhon} Erewhons, and ${counts.innout} In-N-Outs are open. IMPORTANT: You MUST include the actual temperature "${weather?.temp}°" in the subtitle. Make it feel personal, warm, and specific to the time/weather. No quotes, no punctuation at the end, lowercase. Examples of the vibe: "72° and golden — the whole city is open", "58° foggy morning, warm matcha waiting", "81° perfect evening for a drive and a double-double". Be creative, don't copy these examples.`;

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          "Content-Type": "application/json",
          "X-Title": "Somewhere in LA",
        },
        body: JSON.stringify({
          model: "anthropic/claude-3.5-haiku",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 30,
        }),
      });

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content?.trim();
      if (text) setSubtitle(text);
    }

    generate().catch(() => {
      // Keep the fallback subtitle
    });
  }, []);

  return subtitle;
}
