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
import Map, {
  mapClickEvent,
  mapCopyCoordinates,
  mapHoverEffect,
  mapLoadGeoJson,
  mapStatusColorLine,
  mapStatusColorPolygon,
} from "../../../components/map/Map";

import { BackButton } from "../../../components/FastNavigation";
import { NextPage } from "next";
import { Page } from "../../../components/Page";
import { Permissions } from "../../../util/permissions";
import { ProgressCard } from "../../../components/Stats";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import { showNotification } from "@mantine/notifications";
import { useClipboard } from "@mantine/hooks";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useState } from "react";
import useUser from "../../../hooks/useUser";

const District: NextPage = ({ id }: any) => {
  const theme = useMantineTheme();
  const clipboard = useClipboard();
  const router = useRouter();
  const [user] = useUser();
  const { data } = useSWR(`/v1/districts/${id}`);
  const [editBlock, setEditBlock] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const { data: users } = useSWR("/v1/users");
  //TODO: readd this when routes are done
  /*
  const { data: adminsettings } = useSWR(
    "/api/admin/settings/get/custom_builders"
  );*/

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if ((user?.permission || 0) >= Permissions.builder) {
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
    <Page name={data?.name || "District"} icon={<IconBuildingBank />} noMargin>
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
              data={
                user
                  ? [
                      {
                        value: user?.username ? user.username : "",
                        label: user?.username,
                        group: "You",
                      },
                    ].concat(
                      /*adminsettings?.value.map((s: any) => ({
                value: s,
                label: s,
                group: "Special",
              })),*/
                      users
                        ?.filter(
                          (u: any) =>
                            u.username !== "root" &&
                            u.username !== user?.username
                        )
                        .sort((a: any, b: any) =>
                          a.username.localeCompare(b.username)
                        )
                        .map((u: any) => ({
                          value: u.username,
                          label: u.username,
                          group: "Other Users",
                        }))
                    )
                  : []
              }
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
          onMapLoaded={async (map: any) => {
            mapHoverEffect(
              map,
              "blocks-layer",
              "blocks",
              (f) => "Block #" + f.properties.id
            );

            mapClickEvent(map, "blocks-layer", (f) => {
              setEditBlock(f.properties);
              setEditOpen(true);
            });

            mapCopyCoordinates(map, clipboard);
          }}
          layerSetup={async (map: any) => {
            await mapLoadGeoJson(
              map,
              `${process.env.NEXT_PUBLIC_API_URL}/v1/map?district=${id}`,
              "blocks-layer",
              "fill",
              "blocks",
              mapStatusColorPolygon,
              mapStatusColorLine,
              (geojson) => {
                if (geojson.data.center.length > 0) {
                  map.flyTo({
                    zoom: 14,
                    center: [geojson.data.center[1], geojson.data.center[0]],
                  });
                }
              }
            );
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
