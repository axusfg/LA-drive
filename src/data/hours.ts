// Hours in 24h format. Closing times past midnight use 24+ (e.g. 25:00 = 1am next day).
// "closed" means not open that day.
export type DayHours = { open: number; close: number } | "closed";

export interface WeeklyHours {
  mon: DayHours;
  tue: DayHours;
  wed: DayHours;
  thu: DayHours;
  fri: DayHours;
  sat: DayHours;
  sun: DayHours;
}

function h(open: number, close: number): DayHours {
  return { open, close };
}

function everyday(open: number, close: number): WeeklyHours {
  return { mon: h(open, close), tue: h(open, close), wed: h(open, close), thu: h(open, close), fri: h(open, close), sat: h(open, close), sun: h(open, close) };
}

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

// ---- Matcha shops ----

const matchaHours: Record<string, WeeklyHours> = {
  "Memorylook": {
    mon: h(8, 20.75), tue: h(8, 20.75), wed: h(8, 20.75), thu: h(8, 20.75),
    fri: h(8, 24), sat: h(8, 24), sun: h(8, 20.75),
  },
  "DAMO (Koreatown)": everyday(8, 18),
  "DAMO (Arts District)": everyday(8, 16),
  "Stereoscope Coffee (Echo Park)": {
    mon: h(6, 19), tue: h(6, 19), wed: h(6, 19), thu: h(6, 19),
    fri: h(6, 19), sat: h(6, 19), sun: h(7, 19),
  },
  "Stereoscope Coffee (Hollywood)": {
    mon: h(6, 19), tue: h(6, 19), wed: h(6, 19), thu: h(6, 19),
    fri: h(6, 19), sat: h(6, 19), sun: h(7, 19),
  },
  "Stereoscope Coffee (Long Beach)": {
    mon: h(6, 20), tue: h(6, 20), wed: h(6, 20), thu: h(6, 20),
    fri: h(6, 20), sat: h(7, 21), sun: h(7, 21),
  },
  "Kettl Tea (Los Feliz)": {
    mon: h(8, 18), tue: h(8, 18), wed: h(8, 18), thu: h(8, 18),
    fri: h(8, 19), sat: h(8, 19), sun: h(8, 18),
  },
  "Community Goods (Edinburgh Ave)": {
    mon: h(7, 16), tue: h(7, 16), wed: h(7, 16), thu: h(7, 16),
    fri: h(7, 16), sat: h(8, 17), sun: h(8, 17),
  },
  "Community Goods (Pacific Design Center)": {
    mon: h(7, 18), tue: h(7, 18), wed: h(7, 18), thu: h(7, 18),
    fri: h(7, 18), sat: h(8, 18), sun: h(8, 18),
  },
  "Stagger Coffee": {
    mon: h(8, 16), tue: h(8, 16), wed: h(8, 16), thu: h(8, 16),
    fri: h(8, 16), sat: h(8, 17), sun: h(8, 17),
  },
  "Maru Coffee (Los Feliz)": {
    mon: h(7, 17), tue: h(7, 17), wed: h(7, 17), thu: h(7, 17),
    fri: h(7, 17), sat: h(7, 17), sun: h(8, 17),
  },
  "Maru Coffee (Arts District)": {
    mon: h(7.5, 17), tue: h(7.5, 17), wed: h(7.5, 17), thu: h(7.5, 17),
    fri: h(7.5, 17), sat: h(8, 17), sun: h(8, 17),
  },
  "Maru Coffee (Beverly Hills)": {
    mon: h(7, 17), tue: h(7, 17), wed: h(7, 17), thu: h(7, 17),
    fri: h(7, 17), sat: h(8, 17), sun: h(8, 17),
  },
  "Archives Of Us": everyday(8, 20),
};

// ---- In-N-Out (uniform hours) ----

const innoutWeekday: WeeklyHours = {
  mon: h(10.5, 25), tue: h(10.5, 25), wed: h(10.5, 25), thu: h(10.5, 25),
  fri: h(10.5, 25.5), sat: h(10.5, 25.5), sun: h(10.5, 25),
};

// ---- Erewhon hours by location ----

const erewhonHours: Record<string, WeeklyHours> = {
  "Erewhon (Grove / Fairfax)": everyday(7, 23),
  "Erewhon (Calabasas)": {
    mon: h(7, 21), tue: h(7, 21), wed: h(7, 21), thu: h(7, 21),
    fri: h(7, 21), sat: h(7, 21), sun: h(8, 21),
  },
  "Erewhon (Venice)": everyday(7, 23),
  "Erewhon (Santa Monica)": everyday(7, 22),
  "Erewhon (Silver Lake)": everyday(7, 23),
  "Erewhon (Studio City)": everyday(7, 23),
  "Erewhon (Beverly Hills)": everyday(7, 23),
  "Erewhon (Culver City)": everyday(7, 21),
  "Erewhon (Pasadena)": everyday(7, 21),
  "Erewhon (Manhattan Beach)": everyday(7, 21),
  "Erewhon (West Hollywood)": everyday(7, 23),
  "Erewhon (Glendale)": everyday(7, 21),
};

export function getHoursForSpot(name: string, type: string): WeeklyHours | null {
  if (type === "matcha") return matchaHours[name] ?? null;
  if (type === "innout") return innoutWeekday;
  if (type === "erewhon") return erewhonHours[name] ?? null;
  return null;
}

export function isOpenNow(name: string, type: string, date: Date = new Date()): boolean {
  const hours = getHoursForSpot(name, type);
  if (!hours) return false;

  const dayKey = DAY_KEYS[date.getDay()];
  const dayHours = hours[dayKey];
  if (dayHours === "closed") return false;

  const currentTime = date.getHours() + date.getMinutes() / 60;

  // Handle hours past midnight (e.g. close at 25:00 means 1am)
  if (dayHours.close > 24) {
    // Open if we're after opening time OR before the past-midnight closing
    return currentTime >= dayHours.open || currentTime < dayHours.close - 24;
  }

  return currentTime >= dayHours.open && currentTime < dayHours.close;
}

export function formatHoursForDay(name: string, type: string, date: Date = new Date()): string {
  const hours = getHoursForSpot(name, type);
  if (!hours) return "";

  const dayKey = DAY_KEYS[date.getDay()];
  const dayHours = hours[dayKey];
  if (dayHours === "closed") return "Closed today";

  return `${formatTime(dayHours.open)} – ${formatTime(dayHours.close > 24 ? dayHours.close - 24 : dayHours.close)}`;
}

function formatTime(t: number): string {
  const h = Math.floor(t);
  const m = Math.round((t - h) * 60);
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const ampm = h < 12 ? "am" : "pm";
  return m === 0 ? `${hour12}${ampm}` : `${hour12}:${String(m).padStart(2, "0")}${ampm}`;
}
