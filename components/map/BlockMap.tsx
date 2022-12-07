import "mapbox-gl/dist/mapbox-gl.css";
import "mapbox-gl-style-switcher/styles.css";

import * as React from "react";

import { LoadingOverlay, useMantineTheme } from "@mantine/core";
import {
  MapboxStyleDefinition,
  MapboxStyleSwitcherControl,
} from "mapbox-gl-style-switcher";
import mapboxgl, { EventData, MapMouseEvent } from "mapbox-gl";

import { IconCheck } from "@tabler/icons";
import MapLoader from "./MapLoader";
import axios from "axios";
import { showNotification } from "@mantine/notifications";
import { useClipboard } from "@mantine/hooks";

interface IMap {
  initialOptions?: Omit<mapboxgl.MapboxOptions, "container">;
  onMapLoaded?(map: mapboxgl.Map): void;
  onMapRemoved?(): void;
  allowFullscreen?: boolean;
  themeControls?: boolean;
  onClick?: (e: MapMouseEvent & EventData, map: any) => void;
}

const styles: MapboxStyleDefinition[] = [
  {
    title: "Dark",
    uri: "mapbox://styles/nudelsuppe/cl7hfjfa0002h14o7h6ai832o",
  },
  {
    title: "Light",
    uri: "mapbox://styles/mapbox/light-v9",
  },
  { title: "Outdoors", uri: "mapbox://styles/mapbox/outdoors-v11" },
  { title: "Satellite", uri: "mapbox://styles/mapbox/satellite-streets-v11" },
  { title: "Streets", uri: "mapbox://styles/mapbox/streets-v11" },
];

function Map({
  initialOptions = {},
  onMapLoaded,
  onMapRemoved,
  allowFullscreen,
  themeControls = true,
  onClick,
}: IMap) {
  const [map, setMap] = React.useState<mapboxgl.Map>();
  const [loading, setLoading] = React.useState(true);
  const [hoveredId, setHoveredId] = React.useState<undefined | string | number>(
    undefined
  );
  const theme = useMantineTheme();
  const mapNode = React.useRef(null);
  const clipboard = useClipboard();

  React.useEffect(() => {
    const node = mapNode.current;

    if (typeof window === "undefined" || node === null) return;

    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
      style: theme.colorScheme == "dark" ? styles[0].uri : styles[1].uri,
      center: [-73.88218471055006, 40.742418839242944],
      zoom: 10.5,
      antialias: true,
      ...initialOptions,
    });

    setMap(mapboxMap);
    mapboxMap.once("load", (ev: any) => {
      onMapLoaded && map && onMapLoaded(map);
      setLoading(false);

      setupLayers();

      if (allowFullscreen)
        mapboxMap.addControl(new mapboxgl.FullscreenControl());
      if (themeControls)
        mapboxMap.addControl(
          new MapboxStyleSwitcherControl(styles, {
            defaultStyle: theme.colorScheme == "dark" ? "Dark" : "Light",
          })
        );
    });
    mapboxMap.on("click", (e) => {
      if (onClick) onClick(e, mapboxMap);
    });
    mapboxMap.on("contextmenu", (e) => {
      clipboard.copy(e.lngLat.lat + ", " + e.lngLat.lng);
      showNotification({
        title: "Copied successfully",
        message: "The coordinates have been copied to your clipboard!",
        icon: <IconCheck size={18} />,
        color: "teal",
      });
    });
    const setupLayers = async () => {
      const blocks = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/map`
      );
      mapboxMap.addSource(`blocks`, {
        type: "geojson",
        data: blocks.data,
      });

      mapboxMap.addLayer({
        id: `blocks-layer`,
        type: "fill",
        source: `blocks`,
        paint: {
          "fill-color": [
            "match",
            ["get", "status"],
            0,
            "rgba(201, 42, 42,0.37)",
            1,
            "rgba(16, 152, 173,0.37)",
            2,
            "rgba(245, 159, 0,0.37)",
            3,
            "rgba(55, 178, 77,0.37)",
            /* other */ "rgba(201, 42, 42,0.37)",
          ],
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1,
            0.5,
          ],
        },
      });
    };

    return () => {
      mapboxMap.remove();
      if (onMapRemoved) onMapRemoved();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flyTo = (lat: any, lon: any) => {
    map?.flyTo({
      center: [lon, lat],
      zoom: 16,
      essential: true,
    });
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <LoadingOverlay visible={loading} />
      <div
        ref={mapNode}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}

export default Map;
