import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";

import {
  LayersControl,
  MapContainer,
  TileLayer,
  useMapEvents
} from "react-leaflet";

import MapLayer from "../MapLayer/MapLayer";
import React from "react";
import { useMantineTheme } from "@mantine/core";

function MapEvent(props: any) {
  const map = useMapEvents(props.events);
  return null;
}
const Map = (props: any) => {
  const theme = useMantineTheme();
  return (
    <div style={{ height: props.height, width: props.width, ...props.style }}>
      <MapContainer
        center={props.center || [40.748457795121574, -73.98565062177646]}
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors &copy; | <a href="https://carto.com/">CARTO</a>'
        zoom={props.zoom || 12}
        scrollWheelZoom={!props.noScroll}
        e
        style={{
          height: "100%",
          width: "100%",
          border: "none",
          cursor:"default",
          ...props.mapStyle,
        }}
        mapPlaceholder={
          <p>
            Loading...
            <noscript>You need to enable JavaScript to see this map.</noscript>
          </p>
        }
        onClick={props?.onClick}
        {...props.leafletOptions}
      >
        {props?.mapEvents && <MapEvent events={props?.mapEvents} />}
        <LayersControl
          // @ts-ignore
          position="topleft"
        >
          <LayersControl.BaseLayer checked name={theme.colorScheme}>
            <TileLayer
              // @ts-ignore
              attribution={`&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>`}
              url={`https://cartodb-basemaps-{s}.global.ssl.fastly.net/${theme.colorScheme}_all/{z}/{x}/{y}.png`}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OpenStreetMap Default">
            <TileLayer
              // @ts-ignore
              attribution={`&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors`}
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              // @ts-ignore
              attribution={`&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://mapbox.com">Mapbox</a>`}
              url="https://api.mapbox.com/styles/v1/nachwahl/ckmkvfkwg00ds17rwt7u4zlyi/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibmFjaHdhaGwiLCJhIjoiY2tta3ZkdXJ2MDAwbzJ1cXN3ejM5N3NkcyJ9.t2yFHFQzb2PAHvPHF16sFw"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Navigation">
            <TileLayer
              // @ts-ignore
              attribution={`&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://mapbox.com">Mapbox</a>`}
              url="https://api.mapbox.com/styles/v1/nachwahl/ckmkvtwzd3l0617s6rmry2gm5/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibmFjaHdhaGwiLCJhIjoiY2tta3ZkdXJ2MDAwbzJ1cXN3ejM5N3NkcyJ9.t2yFHFQzb2PAHvPHF16sFw"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Base">
            <TileLayer
              // @ts-ignore
              attribution={`&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://mapbox.com">Mapbox</a>`}
              url="https://api.mapbox.com/styles/v1/nachwahl/ckmkvx4vbeplx17qyfztyb6pk/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibmFjaHdhaGwiLCJhIjoiY2tta3ZkdXJ2MDAwbzJ1cXN3ejM5N3NkcyJ9.t2yFHFQzb2PAHvPHF16sFw"
            />
          </LayersControl.BaseLayer>

          {props.children}
          <MapLayer
            checked={props.defaultLayerChecked!=null?props.defaultLayerChecked:true}
            name={props.defaultLayerName || "Default Layer"}
            components={props.components}
          />
        </LayersControl>
      </MapContainer>
    </div>
  );
};



export default Map;
