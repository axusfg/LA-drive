import * as turf from "@turf/turf";
import type { Spot } from "../data/spots";
import { allSpots } from "../data/spots";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string;

export interface RouteResult {
  geometry: GeoJSON.LineString;
  duration: number; // seconds
  distance: number; // meters
}

export interface SpotOnRoute {
  spot: Spot;
  /** Estimated arrival time (Date object) based on departure time + fraction along route */
  eta: Date;
  /** Seconds from departure to this spot */
  etaSeconds: number;
}

export async function getRoute(
  start: [number, number], // [lng, lat]
  end: [number, number]
): Promise<RouteResult> {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.routes?.length) throw new Error("No route found");
  const route = data.routes[0];
  return {
    geometry: route.geometry,
    duration: route.duration,
    distance: route.distance,
  };
}

/**
 * Find all spots within `maxDistanceKm` of the route polyline,
 * sorted by position along the route, with estimated arrival times.
 */
export function spotsNearRoute(
  routeGeometry: GeoJSON.LineString,
  routeDuration: number,
  departureTime: Date = new Date(),
  maxDistanceKm: number = 1.5
): SpotOnRoute[] {
  const line = turf.lineString(routeGeometry.coordinates);
  const totalLength = turf.length(line, { units: "kilometers" });

  const results: SpotOnRoute[] = [];

  for (const spot of allSpots) {
    const pt = turf.point([spot.lng, spot.lat]);
    const distance = turf.pointToLineDistance(pt, line, { units: "kilometers" });
    if (distance > maxDistanceKm) continue;

    // Find nearest point on the route line
    const snapped = turf.nearestPointOnLine(line, pt, { units: "kilometers" });
    const distanceAlong = snapped.properties.location ?? 0; // km along the line
    const fraction = totalLength > 0 ? distanceAlong / totalLength : 0;

    const etaSeconds = Math.round(fraction * routeDuration);
    const eta = new Date(departureTime.getTime() + etaSeconds * 1000);

    results.push({ spot, eta, etaSeconds });
  }

  // Sort by position along route
  results.sort((a, b) => a.etaSeconds - b.etaSeconds);

  return results;
}
