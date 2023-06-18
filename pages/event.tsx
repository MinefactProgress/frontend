import {
  Alert,
  Button,
  Checkbox,
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
} from "../components/map/Map";

import { BackButton } from "../components/FastNavigation";
import { Page } from "../components/Page";
import { Permissions } from "../util/permissions";
import { ProgressCard } from "../components/Stats";
import axios from "axios";
import { showNotification } from "@mantine/notifications";
import { useClipboard } from "@mantine/hooks";
import useSWR from "swr";
import { useState } from "react";
import useUser from "../hooks/useUser";

const Event = () => {
  const id = 16;
  const theme = useMantineTheme();
  const [user] = useUser();
  const [editBlock, setEditBlock] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const { data } = useSWR("/v1/event/blocks");
  const clipboard = useClipboard();
  const { data: users } = useSWR("/v1/users");
  const handleSubmit = (event: any) => {
    event.preventDefault();
    if ((user?.permission || 0) >= Permissions.event) {
      if (editBlock) {
        const editBlockClone = { ...editBlock };
        const builders = editBlockClone?.builder.split(",");
        editBlockClone.builder = builders;
        console.log(builders);
        fetch(
          process.env.NEXT_PUBLIC_API_URL + `/v1/blocks/${editBlockClone.uid}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + user?.token,
            },
            body: JSON.stringify({ ...editBlockClone }),
          }
        )
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
                  "The data of Block " +
                  editBlockClone?.id +
                  " has been updated",
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
    <Page name="Event" icon={<IconBuildingBank />} noMargin>
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
          {data?.length <= 0 ? (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Warning!"
              color="red"
              variant="outline"
              mt="md"
            >
              There is currently no ongoing event.
            </Alert>
          ) : (
            <ProgressCard
              value={data?.filter((d: any) => d.status == 4).length}
              title={"Event"}
              max={data?.length}
              descriptor="Blocks finished"
            ></ProgressCard>
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
            const data = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/v1/map?event=true`
            );
            await mapLoadGeoJson(
              map,
              data,
              "blocks-layer",
              "fill",
              "blocks",
              mapStatusColorPolygon,
              undefined,
              mapStatusColorLine
            );
          }}
        />
      </div>
    </Page>
  );
};
export default Event;
