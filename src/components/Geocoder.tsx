import { useState, useRef, useCallback, useEffect, useImperativeHandle, forwardRef } from "react";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string;
const SESSION_TOKEN = crypto.randomUUID();

interface Suggestion {
  mapbox_id: string;
  name: string;
  full_address?: string;
  place_formatted?: string;
}

export interface GeocoderHandle {
  clear: () => void;
  setValue: (text: string) => void;
}

interface GeocoderProps {
  placeholder: string;
  onResult: (coords: [number, number], placeName: string) => void;
}

const Geocoder = forwardRef<GeocoderHandle, GeocoderProps>(function Geocoder({ placeholder, onResult }, ref) {
  useImperativeHandle(ref, () => ({
    clear() {
      setQuery("");
      setSuggestions([]);
      setOpen(false);
    },
    setValue(text: string) {
      setQuery(text);
      setSuggestions([]);
      setOpen(false);
    },
  }));
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    try {
      const params = new URLSearchParams({
        q,
        access_token: MAPBOX_TOKEN,
        session_token: SESSION_TOKEN,
        proximity: "-118.25,34.05",
        types: "poi,address,place,locality,neighborhood",
        limit: "5",
        language: "en",
        country: "US",
      });
      const res = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/suggest?${params}`
      );
      const data = await res.json();
      setSuggestions(data.suggestions ?? []);
      setOpen((data.suggestions ?? []).length > 0);
      setActiveIndex(-1);
    } catch {
      setSuggestions([]);
    }
  }, []);

  const handleInput = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 200);
  };

  const selectSuggestion = async (s: Suggestion) => {
    setQuery(s.name);
    setOpen(false);
    setSuggestions([]);
    try {
      const params = new URLSearchParams({
        access_token: MAPBOX_TOKEN,
        session_token: SESSION_TOKEN,
      });
      const res = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/retrieve/${s.mapbox_id}?${params}`
      );
      const data = await res.json();
      const feature = data.features?.[0];
      if (feature) {
        const coords: [number, number] = feature.geometry.coordinates;
        const name = feature.properties?.full_address ?? feature.properties?.name ?? s.name;
        onResult(coords, name);
      }
    } catch {
      // ignore retrieve errors
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="geocoder" ref={containerRef}>
      <input
        className="geocoder-input"
        type="text"
        value={query}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      {open && suggestions.length > 0 && (
        <ul className="geocoder-suggestions">
          {suggestions.map((s, i) => (
            <li
              key={s.mapbox_id}
              className={`geocoder-suggestion${i === activeIndex ? " active" : ""}`}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseDown={() => selectSuggestion(s)}
            >
              <span className="geocoder-suggestion-name">{s.name}</span>
              {(s.place_formatted || s.full_address) && (
                <span className="geocoder-suggestion-address">
                  {s.place_formatted || s.full_address}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default Geocoder;
