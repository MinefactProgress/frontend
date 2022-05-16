import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import {
  Circle,
  LayersControl,
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import React, { useEffect, useState } from "react";

import Link from "next/link";

const Map = (props: any) => {
  return (
    <div style={{ height: props.height, width: props.width, ...props.style }}>
      <MapContainer
        center={props.center || [40.748457795121574, -73.98565062177646]}
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors &copy; | <a href="https://carto.com/">CARTO</a>'
        zoom={props.zoom || 12}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", border: "none" }}
        mapPlaceholder={
          <p>
            Loading...
            <noscript>You need to enable JavaScript to see this map.</noscript>
          </p>
        }
        {...props.leafletOptions}
      >
        <TileLayer
          // @ts-ignore
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors &copy; | <a href="https://carto.com/">CARTO</a>'
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
        />
        {props.components?.map((component: any) => {
          if (component == null) return null;
          if (component.type === "polygon") {
            return (
              <Polygon
                key={component.id}
                positions={component.positions}
                pathOptions={component.options}
                eventHandlers={component.eventHandlers}
                {...component}

              >
                {component.tooltip && (
                  <Tooltip>
                    <span>{component.tooltip}</span>
                  </Tooltip>
                )}
              </Polygon>
            );
          }
          if (component.type === "marker") {
            return (
              <Marker key={component.id} position={component.position}
              eventHandlers={component.eventHandlers}
              {...component}>
                {component.tooltip && (
                  <Tooltip>
                    <span>{component.tooltip}</span>
                  </Tooltip>
                )}
                {component.popup && (
                  <Popup>
                    <span>{component.popup}</span>
                  </Popup>
                )}
              </Marker>
            );
          }
          if (component.type === "circle") {
            return (
              <Circle
                key={component.id}
                center={component.center}
                pathOptions={component.options}
                eventHandlers={component.eventHandlers}
                // @ts-ignore
                radius={component.radius || 10}
                {...component}
              >
                {component.tooltip && (
                  <Tooltip>
                    <span>{component.tooltip}</span>
                  </Tooltip>
                )}
              </Circle>
            );
          }
        })}
      </MapContainer>
    </div>
  );
};

export default Map;
