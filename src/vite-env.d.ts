/// <reference types="vite/client" />

declare module "@mapbox/mapbox-gl-geocoder" {
  import { IControl, Map } from "mapbox-gl";

  interface GeocoderOptions {
    accessToken: string;
    types?: string;
    bbox?: [number, number, number, number];
    placeholder?: string;
    marker?: boolean;
    mapboxgl?: typeof import("mapbox-gl");
  }

  class MapboxGeocoder implements IControl {
    constructor(options: GeocoderOptions);
    addTo(container: HTMLElement | string): this;
    on(event: string, callback: (e: any) => void): this;
    onAdd(map: Map): HTMLElement;
    onRemove(): void;
    getDefaultPosition(): string;
  }

  export default MapboxGeocoder;
}
