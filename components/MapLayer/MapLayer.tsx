import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";

import {
  Circle,
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
  Tooltip,
  useMapEvents,
} from "react-leaflet";

function MapLayer(props: {
    name: string;
    components?: any;
    checked?: boolean;
  }) {
    return (
      <LayersControl.Overlay name={props.name} checked={props.checked}>
        <LayerGroup>
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
                <Marker
                  key={component.id}
                  position={component.position}
                  eventHandlers={component.eventHandlers}
                  {...component}
                >
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
        </LayerGroup>
      </LayersControl.Overlay>
    );
  }

  export default MapLayer;