import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import {
  Alert,
  Anchor,
  Button,
  Group,
  Select,
  useMantineTheme,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconCheck,
  IconEdit,
  IconReload,
} from "@tabler/icons";
import {
  SnapLineMode,
  SnapModeDrawStyles,
  SnapPointMode,
  SnapPolygonMode,
} from "mapbox-gl-draw-snap-mode";
import { useEffect, useState } from "react";

import { showNotification } from "@mantine/notifications";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Page } from "../../../components/Page";
import Map from "../../../components/map/Map";
import useUser from "../../../hooks/useUser";

const BlockEdit: NextPage = ({}: any) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const [map, setMap] = useState<mapboxgl.Map>();
  const [newBlock, setNewBlock] = useState<any | null>(null);
  const [district, setDistrict] = useState<any | null>(null);
  const { data } = useSWR("/v1/districts");
  const [user] = useUser();
  useEffect(() => console.log(data), [data]);

  const handleAddBlock = () => {
    if (!newBlock) return;
    if (!district) return;
    console.log(newBlock);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/blocks`, {
      method: "POST",
      body: JSON.stringify({
        district: district,
        area: newBlock.geometry.coordinates,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user?.token,
      },
    })
      .then((res) => res.json())
      .then((d) => {
        if (d?.data?.error) {
          showNotification({
            title: "Error Creating Block",
            message: d.message,
            color: "red",
          });
        } else {
          showNotification({
            title: "Block Created",
            message: "The Block " + d?.data?.data?.uid + " has been created",
            color: "green",
            icon: <IconCheck />,
          });
          setNewBlock(null);
        }
      });
  };

  return (
    <Page name="Edit Blocks" icon={<IconEdit />} noMargin>
      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <Map
          geocoderControls={false}
          onMapLoaded={async (map: any) => {
            const drawOpts = {
              modes: {
                ...MapboxDraw.modes,
                draw_point: SnapPointMode,
                draw_polygon: SnapPolygonMode,
                draw_line_string: SnapLineMode,
              },
              controls: {
                point: false,
                line_string: false,
                trash: false,
                combine_features: false,
                uncombine_features: false,
              },
              styles: SnapModeDrawStyles,
              userProperties: true,
              snap: true,
              snapOptions: {
                snapPx: 15,
                snapToMidPoints: true,
                snapVertexPriorityDistance: 0.0025,
              },
              guides: false,
            };

            const draw = new MapboxDraw(drawOpts);

            fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/map`)
              .then((r) => r.json())
              .then((d) => draw.add(d));

            map.addControl(draw);

            map.on("draw.create", (e: any) => {
              setNewBlock(e.features[0]);
            });
          }}
          setMapRef={(map) => {
            setMap(map);
          }}
        />
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
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Warning!"
            color="red"
            variant="outline"
            my="md"
          >
            Only edit blocks if you know what you are doing
          </Alert>
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Information"
            color="lime"
            variant="outline"
            my="md"
          >
            View the district map{" "}
            <Anchor
              href="https://www.google.com/maps/d/u/0/edit?mid=1zVD-Rl7kMw3RQ_LSQQTAsrdG8NAB_526&usp=sharing"
              target="_blank"
            >
              here
            </Anchor>
            .
          </Alert>
          <Select
            withinPortal
            searchable
            onChange={setDistrict}
            placeholder="Select District"
            nothingFound="Nothing found"
            data={
              data
                ? data
                    ?.filter((d: any) => d.parent != null && d.parent != 1)
                    .map((d: any) => ({ value: d.id, label: d.name }))
                : []
            }
            mb="md"
          />
          <Button
            onClick={() => handleAddBlock()}
            disabled={!newBlock}
            fullWidth
          >
            Add Block
          </Button>
        </div>
      </div>
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
