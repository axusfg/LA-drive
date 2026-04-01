import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { allSpots } from "../data/spots";
import type { Spot } from "../data/spots";

interface Props {
  map: mapboxgl.Map | null;
  onSpotClick: (spot: Spot) => void;
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

function getVisibleSpots(map: mapboxgl.Map): Spot[] {
  const bounds = map.getBounds();
  return allSpots.filter((s) =>
    bounds.contains([s.lng, s.lat])
  );
}

export default function NearbyCarousel({ map, onSpotClick }: Props) {
  const [spots, setSpots] = useState<Spot[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!map) return;

    function update() {
      setSpots(getVisibleSpots(map));
    }

    update();
    map.on("moveend", update);
    map.on("zoomend", update);

    return () => {
      map.off("moveend", update);
      map.off("zoomend", update);
    };
  }, [map]);

  if (spots.length === 0) return null;

  return (
    <div className="nearby-carousel">
      <div className="nearby-label">{spots.length} spots in view</div>
      <div className="nearby-scroll" ref={scrollRef}>
        {spots.map((spot) => (
          <button
            key={`${spot.lng},${spot.lat}`}
            className="nearby-card"
            onClick={() => onSpotClick(spot)}
          >
            <span className="nearby-emoji">{spotEmoji(spot.type)}</span>
            <div className="nearby-info">
              <strong>{spot.name}</strong>
              <span className="nearby-stars">
                <span className="stars-filled">{renderStars(spot.rating)}</span>
                <span className="stars-rating">{spot.rating}</span>
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
