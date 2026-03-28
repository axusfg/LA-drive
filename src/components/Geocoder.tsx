import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string;

interface GeocoderProps {
  placeholder: string;
  onResult: (coords: [number, number], placeName: string) => void;
}

export default function Geocoder({ placeholder, onResult }: GeocoderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const geocoderRef = useRef<MapboxGeocoder | null>(null);

  useEffect(() => {
    if (!containerRef.current || geocoderRef.current) return;

    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_TOKEN,
      mapboxgl: mapboxgl as any,
      types: "address,poi,place,neighborhood",
      bbox: [-118.8, 33.6, -117.6, 34.8],
      placeholder,
      marker: false,
    });

    geocoder.addTo(containerRef.current);
    geocoder.on("result", (e: { result: { center: [number, number]; place_name: string } }) => {
      onResult(e.result.center, e.result.place_name);
    });

    geocoderRef.current = geocoder;

    return () => {
      geocoder.onRemove();
      geocoderRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} />;
}
