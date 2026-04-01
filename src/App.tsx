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
import { erewhonPhotos, erewhonKnownFor } from "./data/erewhon-menu";
import { innoutPhotos, INNOUT_FALLBACK } from "./data/innout-photos";
import { matchaPhotos, matchaKnownFor } from "./data/matcha-photos";
import MatchaProfile from "./components/MatchaProfile";
import ErewhonProfile from "./components/ErewhonProfile";
import SidebarChat from "./components/SidebarChat";
import SlotCounter from "./components/SlotCounter";
import { useCountUp } from "./hooks/useCountUp";
import "./App.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string;

const LUCKY_ROUTES: { from: { name: string; coords: [number, number] }; to: { name: string; coords: [number, number] } }[] = [
  { from: { name: "Griffith Observatory", coords: [-118.3004, 34.1184] }, to: { name: "Santa Monica Pier", coords: [-118.4981, 34.0094] } },
  { from: { name: "The Getty Museum", coords: [-118.4745, 34.0780] }, to: { name: "Laguna Beach", coords: [-117.7831, 33.5427] } },
  { from: { name: "USC", coords: [-118.2851, 34.0224] }, to: { name: "The Huntington Library", coords: [-118.1145, 34.1292] } },
  { from: { name: "Venice Beach", coords: [-118.4726, 33.9850] }, to: { name: "Griffith Observatory", coords: [-118.3004, 34.1184] } },
  { from: { name: "LAX", coords: [-118.4085, 33.9425] }, to: { name: "Pasadena City Hall", coords: [-118.1445, 34.1478] } },
  { from: { name: "The Getty Museum", coords: [-118.4745, 34.0780] }, to: { name: "Ritz-Carlton Dana Point", coords: [-117.6961, 33.4603] } },
  { from: { name: "Malibu Pier", coords: [-118.6776, 34.0367] }, to: { name: "Downtown LA", coords: [-118.2437, 34.0522] } },
  { from: { name: "Hollywood Sign Trailhead", coords: [-118.3217, 34.1341] }, to: { name: "Long Beach Aquarium", coords: [-118.1964, 33.7627] } },
  { from: { name: "Rose Bowl Stadium", coords: [-118.1676, 34.1613] }, to: { name: "Manhattan Beach Pier", coords: [-118.4109, 33.8847] } },
  { from: { name: "Dodger Stadium", coords: [-118.2400, 34.0739] }, to: { name: "Huntington Beach Pier", coords: [-117.9995, 33.6553] } },
];

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
      <span><strong>{miles.toFixed(1)} mi</strong> distance</span>
      <span><strong>{Math.round(mins)} min</strong> drive time</span>
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
  const [waypoints, setWaypoints] = useState<[number, number][]>([]);
  const [addedSpots, setAddedSpots] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ matcha: true, innout: true, erewhon: true });
  const [mapHint, setMapHint] = useState<string | null>("Click to set your start");
  const [expandedCategory, setExpandedCategory] = useState<SpotType | null>(null);
  const [profileSpot, setProfileSpot] = useState<Spot | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

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

    map.on("style.load", () => {
      // Warm land background — lighter than sidebar so the card stands out
      if (map.getLayer("land")) {
        map.setPaintProperty("land", "background-color", "#eae5de");
      }
      if (map.getLayer("background")) {
        map.setPaintProperty("background", "background-color", "#eae5de");
      }

      // Soft blue water
      if (map.getLayer("water")) {
        map.setPaintProperty("water", "fill-color", "#d4e4ed");
      }

      // Green parks, warm sand
      if (map.getLayer("landuse")) {
        map.setPaintProperty("landuse", "fill-color", [
          "match", ["get", "class"],
          "park", "#d4e8d0",
          "cemetery", "#d4e8d0",
          "glacier", "#e0eff0",
          "pitch", "#c8dfb8",
          "sand", "#f0e6d9",
          "#ede7de",
        ]);
      }

      // Warm road colors
      const roadLayers = [
        "road-street", "road-minor", "road-major-link",
        "road-motorway-trunk-link", "road-motorway-trunk",
        "road-major", "road-construction",
      ];
      for (const id of roadLayers) {
        if (map.getLayer(id)) {
          map.setPaintProperty(id, "line-color", "#e8dfd3");
        }
      }

      // Warmer highway casings
      const casingLayers = [
        "road-street-case", "road-minor-case", "road-major-link-case",
        "road-motorway-trunk-link-case", "road-motorway-trunk-case",
        "road-major-case",
      ];
      for (const id of casingLayers) {
        if (map.getLayer(id)) {
          map.setPaintProperty(id, "line-color", "#ddd0c1");
        }
      }

      // Warm brown labels instead of cool grey
      const labelLayers = [
        "road-label", "road-number-shield",
        "settlement-label", "settlement-subdivision-label",
        "poi-label", "airport-label",
        "natural-point-label", "natural-line-label",
        "state-label", "country-label",
      ];
      for (const id of labelLayers) {
        if (map.getLayer(id)) {
          try {
            map.setPaintProperty(id, "text-color", "#7a6557");
          } catch {
            // some label layers may not support text-color
          }
        }
      }

      // Soften building fills
      if (map.getLayer("building")) {
        map.setPaintProperty("building", "fill-color", "#e2dbd2");
      }
    });
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

    // Photo banner + menu highlights per category
    let photoHTML = "";
    let menuHTML = "";
    if (spot.type === "erewhon") {
      const photo = erewhonPhotos[spot.name];
      if (photo) {
        photoHTML = `<div class="popup-photo"><img src="${photo}" alt="${spot.name}" /></div>`;
      }
      const knownFor = erewhonKnownFor[spot.name];
      if (knownFor) {
        menuHTML = `<div class="popup-menu"><p class="popup-menu-title">Known for</p>${knownFor.map((item) => `<span class="popup-menu-item">${item}</span>`).join("")}</div>`;
      }
    } else if (spot.type === "innout") {
      const photo = innoutPhotos[spot.address] ?? INNOUT_FALLBACK;
      photoHTML = `<div class="popup-photo"><img src="${photo}" alt="${spot.name}" /></div>`;
      menuHTML = `<div class="popup-menu"><p class="popup-menu-title">Fan favorites</p><span class="popup-menu-item">🍔 Double-Double</span><span class="popup-menu-item">🍟 Animal Style Fries</span><span class="popup-menu-item">🥤 Neapolitan Shake</span></div>`;
    } else if (spot.type === "matcha") {
      const photo = matchaPhotos[spot.name];
      if (photo) {
        photoHTML = `<div class="popup-photo"><img src="${photo}" alt="${spot.name}" /></div>`;
      }
      const knownFor = matchaKnownFor[spot.name];
      if (knownFor) {
        menuHTML = `<div class="popup-menu"><p class="popup-menu-title">Known for</p>${knownFor.map((item) => `<span class="popup-menu-item">${item}</span>`).join("")}</div>`;
      }
    }

    const profileLink = (spot.type === "matcha" || spot.type === "erewhon")
      ? `<button class="popup-profile-link">View full profile →</button>`
      : "";

    return `<div class="popup-content">${photoHTML}<strong>${spot.name}</strong>${starsHTML}<p>${spot.address}</p>${etaLine}<p class="popup-hours ${statusClass}">${statusText}${atArrival} · ${hours}</p>${menuHTML}${profileLink}</div>`;
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
      const isAdded = addedSpots.has(`${spot.lng},${spot.lat}`);
      const el = document.createElement("div");
      el.className = `spot-marker ${spot.type}${!open && route ? " spot-closed" : ""}${isAdded ? " spot-added" : ""}`;
      el.textContent = spotEmoji(spot.type);
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        popupRef.current?.remove();

        // Nudge map so marker is in a safe zone for the popup
        const pixel = map.project([spot.lng, spot.lat]);
        const w = map.getContainer().clientWidth;
        const h = map.getContainer().clientHeight;
        const margin = 200; // pixels of safe space needed for popup
        let targetX = pixel.x;
        let targetY = pixel.y;
        if (pixel.y < margin) targetY = margin;
        if (pixel.y > h - margin) targetY = h - margin;
        if (pixel.x < w * 0.45) targetX = w * 0.45;
        if (pixel.x > w - margin) targetX = w - margin;

        if (targetX !== pixel.x || targetY !== pixel.y) {
          const targetLngLat = map.unproject([targetX, targetY]);
          const currentCenter = map.getCenter();
          const newCenter: [number, number] = [
            currentCenter.lng + (spot.lng - targetLngLat.lng),
            currentCenter.lat + (spot.lat - targetLngLat.lat),
          ];
          map.easeTo({ center: newCenter, duration: 250 });
        }

        // Small delay to let the pan settle before showing popup
        setTimeout(() => {
          const popup = new mapboxgl.Popup({
            offset: 20,
            closeOnClick: false,
            maxWidth: "320px",
          })
            .setLngLat([spot.lng, spot.lat])
            .setHTML(popupHTML(spot, eta))
            .addTo(map);
          popupRef.current = popup;
          // Wire up the "View full profile" link for matcha and erewhon
          if (spot.type === "matcha" || spot.type === "erewhon") {
            const link = popup.getElement()?.querySelector(".popup-profile-link");
            link?.addEventListener("click", () => {
              popup.remove();
              setProfileSpot(spot);
            });
          }
        }, 300);
      });
      markersRef.current.push(
        new mapboxgl.Marker(el).setLngLat([spot.lng, spot.lat]).addTo(map)
      );
    });
  }, [start, end, mapSpots, addedSpots]);


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
        // Soft glow behind the route
        map.addLayer({
          id: "route-glow",
          type: "line",
          source: "route",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": "#c47a52", "line-width": 12, "line-opacity": 0.1, "line-blur": 6 },
        });

        // Main route line
        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": "#c47a52", "line-width": 5, "line-opacity": 0.85 },
        });
      }

      if (route) {
        const coords = route.geometry.coordinates as [number, number][];
        const bounds = coords.reduce(
          (b, c) => b.extend(c),
          new mapboxgl.LngLatBounds(coords[0], coords[0])
        );
        map.fitBounds(bounds, { padding: { top: 60, right: 60, bottom: 60, left: 440 } });
      }
    };

    if (map.isStyleLoaded()) {
      addRoute();
    } else {
      map.on("load", addRoute);
    }
  }, [route]);

  const handleRoute = useCallback(async (wps: [number, number][] = waypoints) => {
    if (!start || !end) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getRoute(start.coords, end.coords, wps);
      setRoute(result);
      const spots = spotsNearRoute(result.geometry, result.duration, new Date());
      setRouteSpots(spots);
    } catch {
      setError("Could not find a route. Try different locations.");
    } finally {
      setLoading(false);
    }
  }, [start, end, waypoints]);

  const handleAddStop = useCallback(async (spot: Spot) => {
    if (!start || !end) return;
    const newWaypoints = [...waypoints, [spot.lng, spot.lat] as [number, number]];
    setWaypoints(newWaypoints);
    setAddedSpots((prev) => new Set(prev).add(`${spot.lng},${spot.lat}`));
    await handleRoute(newWaypoints);
  }, [start, end, waypoints, handleRoute]);

  const handleClear = useCallback(() => {
    setStart(null);
    setEnd(null);
    setRoute(null);
    setRouteSpots([]);
    setWaypoints([]);
    setAddedSpots(new Set());
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

  const handleLucky = useCallback(() => {
    const pick = LUCKY_ROUTES[Math.floor(Math.random() * LUCKY_ROUTES.length)];
    setStart({ coords: pick.from.coords, name: pick.from.name });
    setEnd({ coords: pick.to.coords, name: pick.to.name });
    startGeocoderRef.current?.setValue(pick.from.name);
    endGeocoderRef.current?.setValue(pick.to.name);
    setMapHint(null);
  }, []);

  const handleChatSpotClick = useCallback((spot: Spot) => {
    const map = mapRef.current;
    if (!map) return;

    // Fly to the spot
    map.flyTo({ center: [spot.lng, spot.lat], zoom: 14, padding: { left: 440, top: 60, right: 60, bottom: 60 } });

    // For matcha/erewhon, open the full profile directly — no popup needed
    if (spot.type === "matcha" || spot.type === "erewhon") {
      setProfileSpot(spot);
    }
  }, []);

  const filteredRouteSpots = displayedRouteSpots ?? [];
  const matchaCount = filteredRouteSpots.filter((s) => s.spot.type === "matcha").length;
  const innoutCount = filteredRouteSpots.filter((s) => s.spot.type === "innout").length;
  const erewhonCount = filteredRouteSpots.filter((s) => s.spot.type === "erewhon").length;

  // Scroll-reveal: fade in spot items as they scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
    );

    const items = document.querySelectorAll(".spot-item.reveal");
    items.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [filteredRouteSpots]);

  return (
    <div className="app">
      <div className="sidebar">
        {chatOpen ? (
          <SidebarChat onBack={() => setChatOpen(false)} onSpotClick={handleChatSpotClick} />
        ) : (
        <>
        <h1>Somewhere in LA</h1>
        <p className="subtitle">find every in-n-out, matcha spot & erewhon on your drive</p>

        <div className="sidebar-ask-bar" onClick={() => setChatOpen(true)}>
          <span className="sidebar-ask-icon">✨</span>
          <span className="sidebar-ask-text">Ask me anything about these spots...</span>
        </div>

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

        <div className="action-buttons">
          <button
            className="route-btn"
            onClick={() => handleRoute()}
            disabled={!start || !end || loading}
          >
            {loading ? "Finding route..." : "Show me the stops"}
          </button>
          {!route && (
            <button className="lucky-btn" onClick={handleLucky}>
              I'm feeling lucky
            </button>
          )}
        </div>

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
          <div className="results stagger-in">
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
                    className={`spot-item ${spot.type}${!open ? " item-closed" : ""} reveal`}
                    onClick={() => {
                      const map = mapRef.current;
                      if (!map) return;
                      map.flyTo({ center: [spot.lng, spot.lat], zoom: 14, padding: { left: 440, top: 60, right: 60, bottom: 60 } });
                      // Open profile directly for matcha/erewhon, popup for innout
                      if (spot.type === "matcha" || spot.type === "erewhon") {
                        setProfileSpot(spot);
                      } else {
                        popupRef.current?.remove();
                        setTimeout(() => {
                          const popup = new mapboxgl.Popup({ offset: 20, closeOnClick: false, maxWidth: "320px", anchor: "left" })
                            .setLngLat([spot.lng, spot.lat])
                            .setHTML(popupHTML(spot, eta))
                            .addTo(map);
                          popupRef.current = popup;
                        }, 300);
                      }
                    }}
                  >
                    <span className="spot-icon">{spotEmoji(spot.type)}</span>
                    <div className="spot-info">
                      <strong>{spot.name}</strong>
                      <Stars rating={spot.rating} reviewCount={spot.reviewCount} />
                      <small>{spot.address}</small>
                      <small className="eta-tag">ETA: {formatTime12(eta)} ({formatEta(etaSeconds)})</small>
                      <small className={`hours-tag ${open ? "open" : "closed"}`}>
                        {open ? "Open at arrival" : "Closed at arrival"} · {formatHoursForDay(spot.name, spot.type, eta)}
                      </small>
                    </div>
                    {addedSpots.has(`${spot.lng},${spot.lat}`) ? (
                      <span className="added-tag">Added</span>
                    ) : (
                      <button
                        className="add-stop-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddStop(spot);
                        }}
                      >
                        + Add
                      </button>
                    )}
                  </li>
                );
              })}
              {filteredRouteSpots.length === 0 && (
                <li className="spot-item empty">No stops found on this route</li>
              )}
            </ul>
          </div>
        )}
        </>
        )}
      </div>

      <div className="map-container">
        <div ref={mapContainerRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
        {mapHint && <div className="map-hint">{mapHint}</div>}
      </div>

      {profileSpot?.type === "matcha" && (
        <MatchaProfile spot={profileSpot} onClose={() => setProfileSpot(null)} />
      )}
      {profileSpot?.type === "erewhon" && (
        <ErewhonProfile spot={profileSpot} onClose={() => setProfileSpot(null)} />
      )}

    </div>
  );
}

export default App;
