import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import { Badge, Button, Group, Modal, Text } from "@mantine/core";
import { IconCheck, IconEdit, IconReload } from "@tabler/icons";
import Map, {
  mapHoverEffect,
  mapLoadGeoJson,
  mapStatusColorLine,
  mapStatusColorPolygon,
} from "../../../components/map/Map";
import { statusToColorName, statusToName } from "../../../util/block";
import useSWR, { mutate } from "swr";

import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type { NextPage } from "next";
import { Page } from "../../../components/Page";
import { Permissions } from "../../../util/permissions";
import axios from "axios";
import { confirmModal } from "../../../util/modal";
import { mapClickEvent } from "../../../components/map/Map";
import mapboxgl from "mapbox-gl";
import modals from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";
import { useState } from "react";
import useUser from "../../../hooks/useUser";

const BlockEdit: NextPage = ({}: any) => {
  const router = useRouter();
  const [map, setMap] = useState<mapboxgl.Map>();
  const [editOpen, edit] = useDisclosure(false);
  const [editBlock, setEditBlock] = useState<any>(null);
  const [user] = useUser();
  const { data: districts } = useSWR("/v1/districts");

  const handleDelete = (block: any) => () => {
    edit.close();
    confirmModal({
      onConfirm: () => {
        if ((user?.permission || 0) >= Permissions.moderator) {
          fetch(
            process.env.NEXT_PUBLIC_API_URL + `/v1/blocks/${editBlock.uid}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user?.token,
              },
            }
          )
            .then((res) => res.json())
            .then(async (res) => {
              if (res.error) {
                showNotification({
                  title: "Error deleting Block",
                  message: res.message,
                  color: "red",
                });
              } else {
                showNotification({
                  title: "Block deleted",
                  message:
                    "Block " +
                    editBlock?.id +
                    " has been deleted. Updating map...",
                  color: "green",
                  icon: <IconCheck />,
                });
                reloadMap(map);
              }
            });
        } else {
          showNotification({
            title: "You do not have permissions to delete blocks",
            message: "You must be a moderator to delete blocks",
            color: "red",
          });
        }
      },
    });
  };

  return (
    <Page name="Edit Blocks" icon={<IconEdit />} noMargin>
      {/* Edit existing block modal */}
      <Modal
        withCloseButton={false}
        opened={editOpen}
        onClose={edit.close}
        title={`Block #${editBlock?.uid} `}
        centered
      >
        <p>
          District:{" "}
          {districts?.find((d: any) => d.id === editBlock?.district)?.name}
        </p>
        <p>
          Status:{" "}
          <Badge color={statusToColorName(editBlock?.status)}>
            {statusToName(editBlock?.status)}
          </Badge>
        </p>
        <Group>
          <Button onClick={edit.close}>Close</Button>
          <Button variant="outline" onClick={handleDelete(editBlock)}>
            Delete
          </Button>
        </Group>
      </Modal>
      <Map
        geocoderControls={false}
        layerSetup={async (map: any) => {
          await mapLoadGeoJson(
            map,
            `${process.env.NEXT_PUBLIC_API_URL}/v1/map`,
            "blocks-layer",
            "fill",
            "blocks",
            mapStatusColorPolygon,
            undefined,
            mapStatusColorLine
          );
        }}
        onMapLoaded={async (map: any) => {
          mapHoverEffect(
            map,
            "blocks-layer",
            "blocks",
            (f) => "Block #" + f.properties.uid
          );
          mapClickEvent(map, "blocks-layer", (f) => {
            setEditBlock(f.properties);

            edit.open();
          });
          const draw = new MapboxDraw({
            controls: {
              point: false,
              line_string: false,
              combine_features: false,
              uncombine_features: false,
            },
            styles: [
              // ACTIVE (being drawn)
              // line stroke
              {
                id: "gl-draw-line",
                type: "line",
                filter: [
                  "all",
                  ["==", "$type", "LineString"],
                  ["!=", "mode", "static"],
                ],
                layout: {
                  "line-cap": "round",
                  "line-join": "round",
                },
                paint: {
                  "line-color": "#38D9A9",
                  "line-dasharray": [0.2, 2],
                  "line-width": 2,
                },
              },
              // polygon fill
              {
                id: "gl-draw-polygon-fill",
                type: "fill",
                filter: [
                  "all",
                  ["==", "$type", "Polygon"],
                  ["!=", "mode", "static"],
                ],
                paint: {
                  "fill-color": "#38D9A9",
                  "fill-outline-color": "#38D9A9",
                  "fill-opacity": 0.1,
                },
              },
              // polygon mid points
              {
                id: "gl-draw-polygon-midpoint",
                type: "circle",
                filter: [
                  "all",
                  ["==", "$type", "Point"],
                  ["==", "meta", "midpoint"],
                ],
                paint: {
                  "circle-radius": 3,
                  "circle-color": "#fbb03b",
                },
              },
              // polygon outline stroke
              // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
              {
                id: "gl-draw-polygon-stroke-active",
                type: "line",
                filter: [
                  "all",
                  ["==", "$type", "Polygon"],
                  ["!=", "mode", "static"],
                ],
                layout: {
                  "line-cap": "round",
                  "line-join": "round",
                },
                paint: {
                  "line-color": "#38D9A9",
                  "line-dasharray": [0.2, 2],
                  "line-width": 2,
                },
              },
              // vertex point halos
              {
                id: "gl-draw-polygon-and-line-vertex-halo-active",
                type: "circle",
                filter: [
                  "all",
                  ["==", "meta", "vertex"],
                  ["==", "$type", "Point"],
                  ["!=", "mode", "static"],
                ],
                paint: {
                  "circle-radius": 5,
                  "circle-color": "#FFF",
                },
              },
              // vertex points
              {
                id: "gl-draw-polygon-and-line-vertex-active",
                type: "circle",
                filter: [
                  "all",
                  ["==", "meta", "vertex"],
                  ["==", "$type", "Point"],
                  ["!=", "mode", "static"],
                ],
                paint: {
                  "circle-radius": 3,
                  "circle-color": "#38D9A9",
                },
              },

              // INACTIVE (static, already drawn)
              // line stroke
              {
                id: "gl-draw-line-static",
                type: "line",
                filter: [
                  "all",
                  ["==", "$type", "LineString"],
                  ["==", "mode", "static"],
                ],
                layout: {
                  "line-cap": "round",
                  "line-join": "round",
                },
                paint: {
                  "line-color": "#000",
                  "line-width": 3,
                },
              },
              // polygon fill
              {
                id: "gl-draw-polygon-fill-static",
                type: "fill",
                filter: [
                  "all",
                  ["==", "$type", "Polygon"],
                  ["==", "mode", "static"],
                ],
                paint: {
                  "fill-color": "#000",
                  "fill-outline-color": "#000",
                  "fill-opacity": 0.1,
                },
              },
              // polygon outline
              {
                id: "gl-draw-polygon-stroke-static",
                type: "line",
                filter: [
                  "all",
                  ["==", "$type", "Polygon"],
                  ["==", "mode", "static"],
                ],
                layout: {
                  "line-cap": "round",
                  "line-join": "round",
                },
                paint: {
                  "line-color": "#000",
                  "line-width": 3,
                },
              },
            ],
          });

          map.addControl(draw);
        }}
        setMapRef={(map) => {
          setMap(map);
        }}
      />
    </Page>
  );
};

export default BlockEdit;

async function reloadMap(map: any) {
  const geojson = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/map`);
  map?.getSource("blocks").setData(geojson.data);
  showNotification({
    title: "Map updated",
    message: "",
    color: "green",
    icon: <IconReload />,
  });
}
