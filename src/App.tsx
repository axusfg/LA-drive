import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Geocoder from "./components/Geocoder";
import type { GeocoderHandle } from "./components/Geocoder";
import { getRoute, spotsNearRoute } from "./utils/route";
import type { RouteResult, SpotOnRoute } from "./utils/route";
import type { Spot } from "./data/spots";
import { allSpots, matchaSpots, innoutSpots, erewhonSpots } from "./data/spots";
import type { SpotType } from "./data/spots";
import { isOpenNow, formatHoursForDay } from "./data/hours";
import SlotCounter from "./components/SlotCounter";
import { useCountUp } from "./hooks/useCountUp";
import "./App.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string;

function formatEta(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatTime12(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const ampm = h < 12 ? "am" : "pm";
  return m === 0 ? `${hour12}${ampm}` : `${hour12}:${String(m).padStart(2, "0")}${ampm}`;
}

function neighborhood(address: string): string {
  // Extract city/neighborhood from "123 Street, City, CA 90000"
  const parts = address.split(",").map((s) => s.trim());
  return parts[1] ?? parts[0];
}

const categorySpots: Record<SpotType, Spot[]> = {
  innout: innoutSpots,
  matcha: matchaSpots,
  erewhon: erewhonSpots,
};

function spotEmoji(type: string): string {
  return type === "matcha" ? "🍵" : type === "erewhon" ? "🥤" : "🍔";
}

function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.3 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}

function Stars({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <span className="stars-row">
      <span className="stars-filled">{renderStars(rating)}</span>
      <span className="stars-rating">{rating}</span>
      <span className="stars-count">({reviewCount.toLocaleString()})</span>
    </span>
  );
}

function RouteStats({ distance, duration }: { distance: number; duration: number }) {
  console.log("[RouteStats] distance:", distance, "duration:", duration);
  const miles = useCountUp(distance / 1609.34);
  const mins = useCountUp(Math.round(duration / 60));
  return (
    <div className="stats">
      <span>{miles.toFixed(1)} mi</span>
      <span>{Math.round(mins)} min</span>
    </div>
  );
}

async function reverseGeocode(coords: [number, number]): Promise<string> {
  try {
    const params = new URLSearchParams({
      access_token: MAPBOX_TOKEN,
      types: "poi,address,place,locality,neighborhood",
      limit: "1",
      language: "en",
    });
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords[0]},${coords[1]}.json?${params}`
    );
    const data = await res.json();
    return data.features?.[0]?.place_name ?? `${coords[1].toFixed(4)}, ${coords[0].toFixed(4)}`;
  } catch {
    return `${coords[1].toFixed(4)}, ${coords[0].toFixed(4)}`;
  }
}

function App() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const prevStartRef = useRef<string | null>(null);
  const prevEndRef = useRef<string | null>(null);
  const startGeocoderRef = useRef<GeocoderHandle>(null);
  const endGeocoderRef = useRef<GeocoderHandle>(null);

  const [start, setStart] = useState<{ coords: [number, number]; name: string } | null>(null);
  const [end, setEnd] = useState<{ coords: [number, number]; name: string } | null>(null);
  const startRef = useRef(start);
  const endRef = useRef(end);
  startRef.current = start;
  endRef.current = end;
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [routeSpots, setRouteSpots] = useState<SpotOnRoute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ matcha: true, innout: true, erewhon: true });
  const [mapHint, setMapHint] = useState<string | null>("Click to set your start");
  const [expandedCategory, setExpandedCategory] = useState<SpotType | null>(null);

  const toggleFilter = (type: keyof typeof filters) =>
    setFilters((f) => ({ ...f, [type]: !f[type] }));

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-118.3, 34.05],
      zoom: 10,
      accessToken: MAPBOX_TOKEN,
    });
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;

    map.on("click", async (e) => {
      const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      const name = await reverseGeocode(coords);

      if (!startRef.current) {
        setStart({ coords, name });
        startGeocoderRef.current?.setValue(name);
        setMapHint("Click to set your destination");
      } else if (!endRef.current) {
        setEnd({ coords, name });
        endGeocoderRef.current?.setValue(name);
        setMapHint(null);
      } else {
        // Both set — reset and start over
        setRoute(null);
        setRouteSpots([]);
        setError(null);
        endGeocoderRef.current?.clear();
        setEnd(null);
        popupRef.current?.remove();
        if (map.getSource("route")) {
          (map.getSource("route") as mapboxgl.GeoJSONSource).setData({
            type: "FeatureCollection",
            features: [],
          });
        }
        setStart({ coords, name });
        startGeocoderRef.current?.setValue(name);
        setMapHint("Click to set your destination");
      }
    });

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Before route: show all spots. After route: show route spots with ETAs.
  const displayedRouteSpots = route
    ? routeSpots.filter((s) => filters[s.spot.type])
    : null;
  const displayedAllSpots = route
    ? null
    : allSpots.filter((s) => filters[s.type]);

  // Helper to get the spots to render on the map
  const mapSpots = useMemo<{ spot: Spot; eta: Date | null }[]>(() => {
    return displayedRouteSpots
      ? displayedRouteSpots.map((s) => ({ spot: s.spot, eta: s.eta }))
      : (displayedAllSpots ?? []).map((s) => ({ spot: s, eta: null }));
  }, [displayedRouteSpots, displayedAllSpots]);

  // Build popup HTML
  function popupHTML(spot: Spot, eta: Date | null): string {
    const checkTime = eta ?? new Date();
    const open = isOpenNow(spot.name, spot.type, checkTime);
    const hours = formatHoursForDay(spot.name, spot.type, checkTime);
    const statusClass = open ? "open" : "closed";
    const statusText = open ? "Open" : "Closed";
    const etaLine = eta
      ? `<p class="popup-eta">ETA: ${formatTime12(eta)} (${formatEta((eta.getTime() - Date.now()) / 1000)})</p>`
      : "";
    const atArrival = eta ? " at arrival" : "";
    const starsHTML = `<p class="popup-stars"><span class="stars-filled">${renderStars(spot.rating)}</span> <span class="stars-rating">${spot.rating}</span> <span class="stars-count">(${spot.reviewCount.toLocaleString()})</span></p>`;
    return `<div class="popup-content"><strong>${spot.name}</strong>${starsHTML}<p>${spot.address}</p>${etaLine}<p class="popup-hours ${statusClass}">${statusText}${atArrival} · ${hours}</p></div>`;
  }

  // Update markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    popupRef.current?.remove();

    const startKey = start ? start.coords.join(",") : null;
    const endKey = end ? end.coords.join(",") : null;
    const isStartNew = startKey !== prevStartRef.current;
    const isEndNew = endKey !== prevEndRef.current;
    prevStartRef.current = startKey;
    prevEndRef.current = endKey;

    function createPin(
      type: "start" | "end",
      coords: [number, number],
      isNew: boolean,
      onDragEnd: (coords: [number, number], name: string) => void,
    ) {
      const wrapper = document.createElement("div");
      wrapper.className = `pin-wrapper${isNew ? " dropping" : ""}`;

      const pin = document.createElement("div");
      pin.className = `pin pin-${type}`;
      pin.innerHTML = `<span class="pin-emoji">${type === "start" ? "🏠" : "📍"}</span>`;

      const shadow = document.createElement("div");
      shadow.className = "pin-shadow";

      wrapper.appendChild(pin);
      wrapper.appendChild(shadow);

      if (isNew) {
        setTimeout(() => wrapper.classList.remove("dropping"), 1000);
      }

      const marker = new mapboxgl.Marker({ element: wrapper, draggable: true, anchor: "bottom" })
        .setLngLat(coords)
        .addTo(map);
      marker.on("dragstart", () => wrapper.classList.add("dragging"));
      marker.on("dragend", async () => {
        wrapper.classList.remove("dragging");
        const lngLat = marker.getLngLat();
        const c: [number, number] = [lngLat.lng, lngLat.lat];
        const name = await reverseGeocode(c);
        onDragEnd(c, name);
      });
      markersRef.current.push(marker);
    }

    if (start) {
      createPin("start", start.coords, isStartNew, (coords, name) => {
        setStart({ coords, name });
        startGeocoderRef.current?.setValue(name);
      });
    }
    if (end) {
      createPin("end", end.coords, isEndNew, (coords, name) => {
        setEnd({ coords, name });
        endGeocoderRef.current?.setValue(name);
      });
    }

    mapSpots.forEach(({ spot, eta }) => {
      const checkTime = eta ?? new Date();
      const open = isOpenNow(spot.name, spot.type, checkTime);
      const el = document.createElement("div");
      el.className = `spot-marker ${spot.type}${!open && route ? " spot-closed" : ""}`;
      el.textContent = spotEmoji(spot.type);
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        popupRef.current?.remove();
        const popup = new mapboxgl.Popup({ offset: 30, closeOnClick: false })
          .setLngLat([spot.lng, spot.lat])
          .setHTML(popupHTML(spot, eta))
          .addTo(map);
        popupRef.current = popup;
      });
      markersRef.current.push(
        new mapboxgl.Marker(el).setLngLat([spot.lng, spot.lat]).addTo(map)
      );
    });
  }, [start, end, mapSpots]);


  // Update route line
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const addRoute = () => {
      if (map.getSource("route")) {
        (map.getSource("route") as mapboxgl.GeoJSONSource).setData(
          route
            ? { type: "Feature", properties: {}, geometry: route.geometry }
            : { type: "FeatureCollection", features: [] }
        );
      } else if (route) {
        map.addSource("route", {
          type: "geojson",
          data: { type: "Feature", properties: {}, geometry: route.geometry },
        });
        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          paint: { "line-color": "#1a1a2e", "line-width": 4, "line-opacity": 0.8 },
        });
      }

      if (route) {
        const coords = route.geometry.coordinates as [number, number][];
        const bounds = coords.reduce(
          (b, c) => b.extend(c),
          new mapboxgl.LngLatBounds(coords[0], coords[0])
        );
        map.fitBounds(bounds, { padding: 60 });
      }
    };

    if (map.isStyleLoaded()) {
      addRoute();
    } else {
      map.on("load", addRoute);
    }
  }, [route]);

  const handleRoute = useCallback(async () => {
    if (!start || !end) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getRoute(start.coords, end.coords);
      setRoute(result);
      const spots = spotsNearRoute(result.geometry, result.duration, new Date());
      setRouteSpots(spots);
    } catch {
      setError("Could not find a route. Try different locations.");
    } finally {
      setLoading(false);
    }
  }, [start, end]);

  const handleClear = useCallback(() => {
    setStart(null);
    setEnd(null);
    setRoute(null);
    setRouteSpots([]);
    setError(null);
    setMapHint("Click to set your start");
    startGeocoderRef.current?.clear();
    endGeocoderRef.current?.clear();
    popupRef.current?.remove();

    // Clear route line from map
    const map = mapRef.current;
    if (map && map.getSource("route")) {
      (map.getSource("route") as mapboxgl.GeoJSONSource).setData({
        type: "FeatureCollection",
        features: [],
      });
    }

    // Reset map view to default LA overview
    map?.flyTo({ center: [-118.3, 34.05], zoom: 10 });
  }, []);

  const filteredRouteSpots = displayedRouteSpots ?? [];
  const matchaCount = filteredRouteSpots.filter((s) => s.spot.type === "matcha").length;
  const innoutCount = filteredRouteSpots.filter((s) => s.spot.type === "innout").length;
  const erewhonCount = filteredRouteSpots.filter((s) => s.spot.type === "erewhon").length;

  return (
    <div className="app">
      <div className="sidebar">
        <h1>LA Drive</h1>
        <p className="subtitle">find every in-n-out, matcha spot & erewhon on your drive</p>

        <div className="toggles">
          <button
            className={`toggle-btn ${filters.matcha ? "active" : "inactive"}`}
            onClick={() => toggleFilter("matcha")}
          >
            <span className="toggle-emoji">🍵</span> Matcha
          </button>
          <button
            className={`toggle-btn ${filters.innout ? "active" : "inactive"}`}
            onClick={() => toggleFilter("innout")}
          >
            <span className="toggle-emoji">🍔</span> In-N-Out
          </button>
          <button
            className={`toggle-btn ${filters.erewhon ? "active" : "inactive"}`}
            onClick={() => toggleFilter("erewhon")}
          >
            <span className="toggle-emoji">🥤</span> Erewhon
          </button>
        </div>

        <div className="inputs">
          <label>From</label>
          <Geocoder
            ref={startGeocoderRef}
            placeholder="Starting location..."
            onResult={(coords, name) => setStart({ coords, name })}
          />
          <label>To</label>
          <Geocoder
            ref={endGeocoderRef}
            placeholder="Destination..."
            onResult={(coords, name) => setEnd({ coords, name })}
          />
        </div>

        <button
          className="route-btn"
          onClick={handleRoute}
          disabled={!start || !end || loading}
        >
          {loading ? "Finding route..." : "Show me the stops"}
        </button>

        {route && (
          <button className="clear-btn" onClick={handleClear}>
            Clear route
          </button>
        )}

        {!route && (
          <div className="fun-stats">
            <div className="fun-stat-cards">
              {([
                { type: "innout" as SpotType, emoji: "🍔", label: "In-N-Outs across SoCal", count: 137 },
                { type: "matcha" as SpotType, emoji: "🍵", label: "matcha spots from 8 brands", count: 16 },
                { type: "erewhon" as SpotType, emoji: "🥤", label: "Erewhon locations", count: 12 },
              ]).map(({ type, emoji, label, count }) => {
                const isOpen = expandedCategory === type;
                const spots = categorySpots[type];
                return (
                  <div key={type} className={`fun-stat-card${isOpen ? " expanded" : ""}`}>
                    <div
                      className="fun-stat-header"
                      onClick={() => setExpandedCategory(isOpen ? null : type)}
                    >
                      <span className="fun-stat-emoji">{emoji}</span>
                      <span className="fun-stat-text">
                        <strong className={`fun-stat-num ${type}-num`}>{count}</strong> {label}
                      </span>
                      <span className={`fun-stat-chevron${isOpen ? " open" : ""}`}>&#8250;</span>
                    </div>
                    <div className={`fun-stat-list-wrap${isOpen ? " open" : ""}`}>
                      <ul className="fun-stat-list">
                        {spots.map((spot, i) => (
                          <li
                            key={i}
                            className="fun-stat-list-item"
                            onClick={() => {
                              const map = mapRef.current;
                              if (!map) return;
                              map.flyTo({ center: [spot.lng, spot.lat], zoom: 15 });
                            }}
                          >
                            <span className="fun-stat-list-name">{spot.name}</span>
                            <span className="fun-stat-list-hood">{neighborhood(spot.address)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="fun-stats-tagline">What are you driving past every day?</p>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        {route && (
          <div className="results">
            <RouteStats distance={route.distance} duration={route.duration} />
            <div className="spot-counts">
              <span className="matcha-badge">🍵 <SlotCounter value={matchaCount} /> matcha</span>
              <span className="innout-badge">🍔 <SlotCounter value={innoutCount} /> In-N-Out</span>
              <span className="erewhon-badge">🥤 <SlotCounter value={erewhonCount} /> Erewhon</span>
            </div>
            <ul className="spot-list">
              {filteredRouteSpots.map(({ spot, eta, etaSeconds }, i) => {
                const open = isOpenNow(spot.name, spot.type, eta);
                return (
                  <li
                    key={i}
                    className={`spot-item ${spot.type}${!open ? " item-closed" : ""}`}
                    onClick={() => {
                      const map = mapRef.current;
                      if (!map) return;
                      map.flyTo({ center: [spot.lng, spot.lat], zoom: 14 });
                      popupRef.current?.remove();
                      const popup = new mapboxgl.Popup({ offset: 30, closeOnClick: false })
                        .setLngLat([spot.lng, spot.lat])
                        .setHTML(popupHTML(spot, eta))
                        .addTo(map);
                      popupRef.current = popup;
                    }}
                  >
                    <span className="spot-icon">{spotEmoji(spot.type)}</span>
                    <div>
                      <strong>{spot.name}</strong>
                      <Stars rating={spot.rating} reviewCount={spot.reviewCount} />
                      <small>{spot.address}</small>
                      <small className="eta-tag">ETA: {formatTime12(eta)} ({formatEta(etaSeconds)})</small>
                      <small className={`hours-tag ${open ? "open" : "closed"}`}>
                        {open ? "Open at arrival" : "Closed at arrival"} · {formatHoursForDay(spot.name, spot.type, eta)}
                      </small>
                    </div>
                  </li>
                );
              })}
              {filteredRouteSpots.length === 0 && (
                <li className="spot-item empty">No stops found on this route</li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="map-container">
        <div ref={mapContainerRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
        {mapHint && <div className="map-hint">{mapHint}</div>}
      </div>
    </div>
  );
}

export default App;
