import {
  ActionIcon,
  Alert,
  Button,
  Checkbox,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  Progress,
  useMantineTheme,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconBackhoe,
  IconBuildingBank,
  IconCheck,
  IconUsers,
} from "@tabler/icons";

import { BackButton } from "../../../components/FastNavigation";
import Map from "../../../components/map/Map";
import { NextPage } from "next";
import { Page } from "../../../components/Page";
import { ProgressCard } from "../../../components/Stats";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useState } from "react";
import useUser from "../../../hooks/useUser";

const District: NextPage = ({ id }: any) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const [user] = useUser();
  const { data } = useSWR(`/v1/districts/${id}`);
  const [editBlock, setEditBlock] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  //TODO: readd this when routes are done
  /*
  const { data: users } = useSWR("/api/users/get");
  const { data: adminsettings } = useSWR(
    "/api/admin/settings/get/custom_builders"
  );*/

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (user) {
      if (
        editBlock &&
        editBlock !=
          data?.blocks.blocks.find((b: any) => b.id === editBlock?.id)
      ) {
        const builders = editBlock?.builder?.split(",");
        editBlock.builder = builders;
        fetch(process.env.NEXT_PUBLIC_API_URL + `/v1/blocks/${editBlock.uid}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user?.token,
          },
          body: JSON.stringify({ district: data.id, ...editBlock }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.error) {
              showNotification({
                title: "Error Updating Block",
                message: res.message,
                color: "red",
              });
            } else {
              showNotification({
                title: "Block Updated",
                message:
                  "The data of Block " + editBlock?.id + " has been updated",
                color: "green",
                icon: <IconCheck />,
              });
            }
          });
      } else {
        showNotification({
          title: "Nothing Changed",
          message: "No changes were made to the block",
        });
      }
    }
  };
  return (
    <Page name="District" icon={<IconBuildingBank />} noMargin>
      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <Modal
          size="md"
          centered
          opened={editOpen}
          onClose={() => setEditOpen(false)}
          title={`Block #${editBlock?.id}`}
        >
          <form onSubmit={handleSubmit}>
            <MultiSelect
              dropdownPosition="top"
              label="Builders"
              searchable
              disabled={!user}
              nothingFound="No builder found"
              placeholder="Select Builders"
              maxDropdownHeight={190}
              icon={<IconUsers size={18} />}
              data={[] /*.concat(
                user
                  ? [{
                      value: user?.username ? user.username : "",
                      label: user?.username,
                      group: "You",
                    }]
                  : []
              )*/
                .concat(
                  /*adminsettings?.value.map((s: any) => ({
                value: s,
                label: s,
                group: "Special",
              })),
              users
                ?.filter(
                  (u: any) =>
                    u.username !== "root" && u.username !== user?.username
                )
                .sort((a: any, b: any) => a.username.localeCompare(b.username))
                .map((u: any) => ({
                  value: u.username,
                  label: u.username,
                  group: "Other Users",
                })),*/ /*.filter(
                (b: any) =>
                  !adminsettings?.value.some((s: any) => s === b) &&
                  !users?.some((u: any) => u.username === b)
              )*/
                  (editBlock?.builder != "" &&
                    editBlock?.builder?.split(",")?.map((b: any) => ({
                      value: b,
                      label: b,
                      group: "Special",
                    }))) ||
                    []
                )}
              value={editBlock?.builder != "" && editBlock?.builder?.split(",")}
              onChange={(e: any) => {
                setEditBlock({
                  ...editBlock,
                  builder: e.join(","),
                });
              }}
            />
            <NumberInput
              mt="md"
              label="Progress"
              disabled={!user}
              min={0}
              max={100}
              icon={<IconBackhoe size={18} />}
              value={editBlock?.progress}
              onChange={(e: any) => {
                setEditBlock({
                  ...editBlock,
                  progress: e,
                });
              }}
            />
            <Progress value={editBlock?.progress} mt="xs" />
            <Checkbox
              label="Street Details"
              mt="md"
              disabled={editBlock?.progress != 100 || !user}
              checked={editBlock?.details}
              onChange={(e: any) => {
                setEditBlock({
                  ...editBlock,
                  details: e.currentTarget.checked,
                });
              }}
            />

            <Button type="submit" mt="md" fullWidth disabled={!user}>
              Update Block
            </Button>
          </form>
        </Modal>
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
            value={data?.blocks.done}
            title={data?.name}
            max={data?.blocks.total}
            descriptor="Blocks finished"
          ></ProgressCard>
          {data?.blocks.blocks.at(-1).area.length <= 0 && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Warning!"
              color="red"
              variant="outline"
              mt="md"
            >
              There may be blocks missing on this map, please wait till we have
              <br />
              added them. You cant change the progress of those yet.
            </Alert>
          )}
        </div>
        <Map
          themeControls={false}
          onMapLoaded={async (map) => {
            // Hover effect
            let hoveredStateId: string | number | undefined = undefined;
            const popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false,
            });

            map.on("mousemove", "blocks-layer", (e) => {
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
                  .setText("Block #" + features[0].properties.id)
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

            map.on("click", (e) => {
              // Find features intersecting the bounding box.
              const selectedFeatures = map.queryRenderedFeatures(e.point, {
                layers: ["blocks-layer"],
              });
              if (selectedFeatures.length > 0) {
                setEditBlock(selectedFeatures[0].properties);
                setEditOpen(true);
              }
              // Set a filter matching selected features by FIPS codes
              // to activate the 'counties-highlighted' layer.
            });
          }}
          layerSetup={async (map) => {
            const blocks = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/v1/map?district=${id}`
            );
            // Fly to district
            if (blocks.data.center.length > 0) {
              map.flyTo({
                zoom: 14,
                center: [blocks.data.center[1], blocks.data.center[0]],
                essential: true, // this animation is considered essential with respect to prefers-reduced-motion
              });
            }

            map.addSource(`blocks`, {
              type: "geojson",
              data: blocks.data,
            });

            map.addLayer({
              id: `blocks-layer`,
              type: "fill",
              source: `blocks`,
              paint: {
                "fill-color": [
                  "match",
                  ["get", "status"],
                  0,
                  "rgb(201, 42, 42)",
                  1,
                  "rgb(16, 152, 173)",
                  2,
                  "rgb(245, 159, 0)",
                  3,
                  "rgb(245, 159, 0)",
                  4,
                  "rgb(55, 178, 77)",
                  "rgb(201, 42, 42)",
                ],
                "fill-opacity": [
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
export async function getServerSideProps({ params }: any) {
  return { props: { id: params.id } };
}

export default District;
