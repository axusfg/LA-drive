import { useState, useCallback, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Geocoder from "./components/Geocoder";
import { getRoute, spotsNearRoute } from "./utils/route";
import type { RouteResult, SpotOnRoute } from "./utils/route";
import type { Spot } from "./data/spots";
import { allSpots } from "./data/spots";
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
  const miles = useCountUp(distance / 1609.34);
  const mins = useCountUp(Math.round(duration / 60));
  return (
    <div className="stats">
      <span>{miles.toFixed(1)} mi</span>
      <span>{Math.round(mins)} min</span>
    </div>
  );
}

function App() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  const [start, setStart] = useState<{ coords: [number, number]; name: string } | null>(null);
  const [end, setEnd] = useState<{ coords: [number, number]; name: string } | null>(null);
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [routeSpots, setRouteSpots] = useState<SpotOnRoute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ matcha: true, innout: true, erewhon: true });

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
  const mapSpots: { spot: Spot; eta: Date | null }[] = displayedRouteSpots
    ? displayedRouteSpots.map((s) => ({ spot: s.spot, eta: s.eta }))
    : (displayedAllSpots ?? []).map((s) => ({ spot: s, eta: null }));

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

    if (start) {
      const el = document.createElement("div");
      el.className = "marker start-marker";
      el.textContent = "A";
      markersRef.current.push(
        new mapboxgl.Marker(el).setLngLat(start.coords).addTo(map)
      );
    }
    if (end) {
      const el = document.createElement("div");
      el.className = "marker end-marker";
      el.textContent = "B";
      markersRef.current.push(
        new mapboxgl.Marker(el).setLngLat(end.coords).addTo(map)
      );
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

  const filteredRouteSpots = displayedRouteSpots ?? [];
  const matchaCount = filteredRouteSpots.filter((s) => s.spot.type === "matcha").length;
  const innoutCount = filteredRouteSpots.filter((s) => s.spot.type === "innout").length;
  const erewhonCount = filteredRouteSpots.filter((s) => s.spot.type === "erewhon").length;

  return (
    <div className="app">
      <div className="sidebar">
        <h1>LA drive</h1>
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
            placeholder="Starting location..."
            onResult={(coords, name) => setStart({ coords, name })}
          />
          <label>To</label>
          <Geocoder
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
      </div>
    </div>
  );
}

export default App;
