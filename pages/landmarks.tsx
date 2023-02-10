import {
  ActionIcon,
  Badge,
  Button,
  Grid,
  Group,
  MediaQuery,
  Paper,
  ScrollArea,
  Select,
  Table,
  Tabs,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";

import { BackButton } from "../components/FastNavigation";
import { IconBuildingMonument } from "@tabler/icons";
import Map from "../components/map/Map";
import { Page } from "../components/Page";
import { ProgressCard } from "../components/Stats";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import useSWR from "swr";

const Landmarks = () => {
  const { data } = useSWR("/v1/landmarks");
  const { data: users } = useSWR("/v1/users");
  const theme = useMantineTheme();

  const requests: {
    name: any;
    done: number;
    claims: number;
    requests: number[];
  }[] = [];
  if (data) {
    for (const landmark of data) {
      // Claims
      for (const user of landmark.builder) {
        if (requests.some((e: any) => e.name === user.user)) {
          requests.some((e: any) => {
            if (e.name === user.user) {
              if (landmark.completed) {
                e.done++;
              } else {
                e.claims++;
              }
            }
          });
        } else {
          if (landmark.completed) {
            requests.push({
              name: user.user,
              done: 1,
              claims: 0,
              requests: [0, 0, 0],
            });
          } else {
            requests.push({
              name: user.user,
              done: 0,
              claims: 1,
              requests: [0, 0, 0],
            });
          }
        }
      }
      // Requests
      for (const user of landmark.requests) {
        if (requests.some((e: any) => e.name === user.user)) {
          requests.some((e: any) => {
            if (e.name === user.user) {
              e.requests[user.priority - 1]++;
            }
          });
        } else {
          requests.push({
            name: user.user,
            done: 0,
            claims: 0,
            requests: [
              +(user.priority === 1),
              +(user.priority === 2),
              +(user.priority === 3),
            ],
          });
        }
      }
    }
  }
  requests.sort((a: any, b: any) => {
    if (a.done === b.done) {
      if (a.claims === b.claims) {
        if (a.requests === b.requests) {
          return a.name.localeCompare(b.name);
        }
        return (
          b.requests.reduce((a: number, b: number) => a + b, 0) -
          a.requests.reduce((a: number, b: number) => a + b, 0)
        );
      }
      return b.claims - a.claims;
    }
    return b.done - a.done;
  });

  const getLandmarkStatus = (landmark: any) => {
    if (!landmark) return 0;
    return !landmark.enabled
      ? 0
      : landmark.completed
      ? 4
      : landmark.requests.lenght > 0
      ? landmark.builder.lenght > 0
        ? 3
        : 2
      : 1;
  };

  return (
    <Page name="Landmarks" icon={<IconBuildingMonument />} noMargin>
      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <div
          style={{
            position: "absolute",
            top: theme.spacing.md,
            left: theme.spacing.md,
            marginRight: theme.spacing.md,
            zIndex: 55,
            minWidth: "25vw",
          }}
        >
          <BackButton variant="outline" mb="md" />
          <ProgressCard
            value={data?.filter((d: any) => getLandmarkStatus(d) >= 4).length}
            title={"Landmarks"}
            max={data?.filter((d: any) => getLandmarkStatus(d) > 0).length}
            descriptor="open Landmarks finished"
          ></ProgressCard>
        </div>
        <Map
          themeControls={false}
          onMapLoaded={async (map: any) => {
            // Hover effect
            let hoveredStateId: string | number | undefined = undefined;
            const popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false,
            });

            map.on("mousemove", "blocks-layer", (e: any) => {
              if (!e.features) {
                popup.remove();
                return;
              }
              if (e?.features.length > 0) {
                // Hover effect
                if (hoveredStateId !== undefined) {
                  map.setFeatureState(
                    { source: "blocks", id: hoveredStateId },
                    { hover: false }
                  );
                }
                hoveredStateId = e.features[0].id;
                map.setFeatureState(
                  { source: "blocks", id: hoveredStateId },
                  { hover: true }
                );

                // Tooltip
                const features = map.queryRenderedFeatures(e.point, {
                  layers: ["blocks-layer"],
                });

                popup
                  .setLngLat(e.lngLat)
                  //@ts-ignore
                  .setText(features[0].properties.name)
                  .addTo(map);
              }
            });
            map.on("mouseleave", "blocks-layer", () => {
              if (hoveredStateId !== undefined) {
                map.setFeatureState(
                  { source: "blocks", id: hoveredStateId },
                  { hover: false }
                );
              }
              hoveredStateId = undefined;

              popup.remove();
            });

            map.on("click", (e: any) => {
              // Find features intersecting the bounding box.
              const selectedFeatures = map.queryRenderedFeatures(e.point, {
                layers: ["blocks-layer"],
              });
              if (selectedFeatures.length > 0) {
                // TODO
                //setEditBlock(selectedFeatures[0].properties);
                //setEditOpen(true);
              }
              // Set a filter matching selected features by FIPS codes
              // to activate the 'counties-highlighted' layer.
            });
          }}
          layerSetup={async (map: any) => {
            const blocks = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/v1/map?landmarks=true`
            );
            map.addSource(`blocks`, {
              type: "geojson",
              data: blocks.data,
            });

            map.addLayer({
              id: `blocks-layer`,
              type: "circle",
              source: `blocks`,
              paint: {
                "circle-radius": {
                  stops: [
                    [8, 1],
                    [11, 6],
                    [16, 40],
                  ],
                },
                "circle-color": [
                  "match",
                  ["get", "status"],
                  0,
                  "rgb(134, 46, 156)", // Purple
                  1,
                  "rgb(201, 42, 42)", // red
                  2,
                  "rgb(16, 152, 173)", //cyan
                  3,
                  "rgb(245, 159, 0)", //orange
                  4,
                  "rgb(55, 178, 77)", // green
                  "rgb(1, 10, 10)",
                ],
                "circle-opacity": [
                  "case",
                  ["boolean", ["feature-state", "hover"], false],
                  1,
                  0.37,
                ],
              },
            });
          }}
        />
      </div>
    </Page>
  );
};

export default Landmarks;
