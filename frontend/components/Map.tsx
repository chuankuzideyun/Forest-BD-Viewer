"use client"
import mapboxgl, { LngLatLike } from "mapbox-gl"
import { useEffect, useRef } from "react"
import { gql } from "../lib/api"

type MapState = {
  center: [number, number]
  zoom: number
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ""

export default function Map({ token }: { token: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapboxgl.accessToken) {
      console.error("Mapbox token missing")
      return
    }

    if (!ref.current) return

    const map = new mapboxgl.Map({
      container: ref.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [2.5, 46.5],
      zoom: 6
    })

    map.addControl(new mapboxgl.NavigationControl())

    const loadLastState = async () => {
      try {
        const res = await gql<{ me: { lastMapState?: MapState } }>(
          `
          query Me {
            me { lastMapState }
          }
          `,
          undefined,
          token
        )
        const state = res.data?.me?.lastMapState as MapState | undefined
        if (state?.center && typeof state.zoom === "number") {
          map.jumpTo({ center: state.center as LngLatLike, zoom: state.zoom })
        }
      } catch (err) {
        console.error("Failed to load map state", err)
      }
    }

    const updateForestLayer = async () => {
      const bounds = map.getBounds()
      try {
        const res = await gql<{ forests: { id: string; geom: any }[] }>(
          `
          query Forests($bbox:[Float!]!){
            forests(bbox:$bbox){ id geom }
          }
          `,
          { bbox: [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()] },
          token
        )

        const features = (res.data?.forests ?? []).map(f => ({
          type: "Feature",
          geometry: f.geom,
          properties: {}
        }))

        const source = map.getSource("forest") as mapboxgl.GeoJSONSource
        if (source) {
          source.setData({ type: "FeatureCollection", features })
        }
      } catch (err) {
        console.error("Failed to load forests", err)
      }
    }

    const persistState = async () => {
      const state: MapState = {
        center: [map.getCenter().lng, map.getCenter().lat],
        zoom: map.getZoom()
      }

      try {
        await gql(
          `
          mutation Save($state:JSON!){
            saveMapState(state:$state)
          }
          `,
          { state },
          token
        )
      } catch (err) {
        console.error("Failed to save map state", err)
      }
    }

    const handleMoveEnd = async () => {
      await updateForestLayer()
      await persistState()
    }

    map.on("load", async () => {
      map.addSource("forest", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      })

      map.addLayer({
        id: "forest",
        type: "fill",
        source: "forest",
        paint: {
          "fill-opacity": 0.6,
          "fill-color": "#2e7d32"
        }
      })

      await loadLastState()
      await updateForestLayer()
    })

    map.on("moveend", handleMoveEnd)

    return () => {
      map.remove()
    }
  }, [token])

  return <div ref={ref} style={{ height: "100vh" }} />
}
