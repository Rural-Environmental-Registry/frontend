declare module '@rural-environmental-registry/map_component' {
  import { DefineComponent } from 'vue'
  import type { LatLngExpression, Map, FeatureGroup, Marker, MarkerOptions } from 'leaflet'

  export type StableMarkerOptions = MarkerOptions & Record<string, unknown>

  export const STABLE_MARKER_DEFAULTS: StableMarkerOptions

  export function createStableMarker(
    leaflet: typeof import('leaflet'),
    latlng: LatLngExpression,
    options?: StableMarkerOptions
  ): Marker

  export function bindMarkerZoomStability(map: Map, layerGroup: FeatureGroup): () => void

  const MapaDpg: DefineComponent<{}, {}, any>
  export default MapaDpg
}
