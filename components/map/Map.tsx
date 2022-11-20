import "mapbox-gl/dist/mapbox-gl.css";
import "mapbox-gl-style-switcher/styles.css";

import * as React from "react";

import { LoadingOverlay, useMantineTheme } from "@mantine/core";
import {
  MapboxStyleDefinition,
  MapboxStyleSwitcherControl,
} from "mapbox-gl-style-switcher";

import MapLoader from "./MapLoader";
import axios from "axios";
import mapboxgl from "mapbox-gl";

interface IMap {
  initialOptions?: Omit<mapboxgl.MapboxOptions, "container">;
  onMapLoaded?(map: mapboxgl.Map): void;
  onMapRemoved?(): void;
  allowFullscreen?: boolean;
  themeControls?: boolean;
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
}: IMap) {
  const [map, setMap] = React.useState<mapboxgl.Map>();
  const [loading, setLoading] = React.useState(true);
  const theme = useMantineTheme();
  const mapNode = React.useRef(null);

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
      maxBounds: [
        [-74.45544404703202, 40.45899214198122],
        [-71.89371398960738, 41.335551550503325],
      ],
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
    const setupLayers = async () => {
      const blocks = await axios.get("");
      mapboxMap.addSource("blocks", {
        type: "geojson",
        data: blocks.data,
      });

      mapboxMap.addLayer({
        id: "blocks-layer",
        type: "fill",
        source: "blocks",
      });
    };

    return () => {
      mapboxMap.remove();
      if (onMapRemoved) onMapRemoved();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
