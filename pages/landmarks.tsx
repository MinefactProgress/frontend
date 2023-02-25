import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Modal,
  Select,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import {
  IconBuildingMonument,
  IconCheck,
  IconCross,
  IconSwitchVertical,
} from "@tabler/icons";
import Map, {
  mapClickEvent,
  mapCopyCoordinates,
  mapHoverEffect,
  mapLoadGeoJson,
} from "../components/map/Map";
import useSWR, { mutate } from "swr";

import { BackButton } from "../components/FastNavigation";
import { Page } from "../components/Page";
import { Permissions } from "../util/permissions";
import { ProgressCard } from "../components/Stats";
import { UsersStack } from "../components/user/UserStack";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import { showNotification } from "@mantine/notifications";
import { useClipboard } from "@mantine/hooks";
import { useRouter } from "next/router";
import { useState } from "react";
import useUser from "../hooks/useUser";

const Landmarks = () => {
  const { data } = useSWR("/v1/landmarks");
  const { data: users } = useSWR("/v1/users");
  const [user] = useUser();
  const theme = useMantineTheme();
  const router = useRouter();
  const clipboard = useClipboard();
  const [selected, setSelected] = useState<any>();
  const [editOpen, setEditOpen] = useState(false);

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

  const handleRequest = (landmark: any, add?: boolean) => {
    var requests = JSON.parse(landmark.requests);
    if (add) {
      requests.push({ user: user?.uid, priority: 3 });
    } else {
      requests = requests.filter((r: any) => r.user != user?.uid);
    }
    fetch(process.env.NEXT_PUBLIC_API_URL + `/v1/landmarks/${landmark.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user?.token,
      },
      body: JSON.stringify({
        requests,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          showNotification({
            title: "Error requesting Landmark",
            message: res.message,
            color: "red",
            icon: <IconCross />,
          });
        } else {
          showNotification({
            title: `${add ? "Unr" : "R"}equested Landmark`,
            message:
              `You ${add ? "" : "un"}requested the Landmark ` +
              landmark.name +
              "!",
            color: "green",
            icon: <IconCheck />,
          });
          mutate("/v1/landmarks");
        }
      });
  };
  const handleBuilder = (landmark: any, userID: number, add?: boolean) => {
    if ((user?.permission || 0) < Permissions.moderator) return;
    var requests = JSON.parse(landmark.requests);
    var builder = JSON.parse(landmark.builder);
    if (add) {
      const newBuilder = requests.filter((r: any) => r.user == userID)[0];
      requests = requests.filter((r: any) => r.user != userID);
      builder.push(newBuilder);
    } else {
      const removedBuilder = builder.filter((r: any) => r.user == userID)[0];
      builder = builder.filter((r: any) => r.user != userID);
      requests.push(removedBuilder);
    }

    fetch(process.env.NEXT_PUBLIC_API_URL + `/v1/landmarks/${landmark.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user?.token,
      },
      body: JSON.stringify({
        requests,
        builder,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          showNotification({
            title: `Error ${add ? "adding" : "removing"} Builder`,
            message: res.message,
            color: "red",
            icon: <IconCross />,
          });
        } else {
          showNotification({
            title: `Builder ${add ? "added" : "removed"}`,
            message:
              `Builder ${
                add ? "added" : "removed"
              } successfully for Landmark ` +
              landmark.name +
              "!",
            color: "green",
            icon: <IconCheck />,
          });
          mutate("/v1/landmarks");
        }
      });
  };
  const handlePriority = (landmark: any, e: any) => {
    var requests = JSON.parse(landmark.requests).filter(
      (r: any) => r.user != user?.uid
    );
    requests.push({ user: user?.uid, priority: e });

    fetch(process.env.NEXT_PUBLIC_API_URL + `/v1/landmarks/${landmark.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user?.token,
      },
      body: JSON.stringify({
        requests,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          showNotification({
            title: "Error updating priority",
            message: res.message,
            color: "red",
            icon: <IconCross />,
          });
        } else {
          showNotification({
            title: "Updated priority",
            message:
              "You changed your priority of " + landmark.name + " to " + e,
            color: "green",
            icon: <IconCheck />,
          });
          mutate("/api/landmarks/get");
        }
      });
  };

  return (
    <Page name="Landmarks" icon={<IconBuildingMonument />} noMargin>
      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <Modal
          size="md"
          centered
          opened={editOpen}
          onClose={() => setEditOpen(false)}
          title={
            <>
              {selected?.name + " "}
              {!selected?.enabled ? (
                <Badge color="grape">Not Available</Badge>
              ) : selected?.done ? (
                <Badge color="green">Done</Badge>
              ) : selected?.requests != "[]" ? (
                selected?.builder != "[]" ? (
                  <Badge color="orange">Claimed</Badge>
                ) : (
                  <Badge color="cyan">Requested</Badge>
                )
              ) : (
                <Badge color="red">Not Claimed</Badge>
              )}
            </>
          }
        >
          {selected?.builder != "[]" && (
            <>
              <Text
                color="dimmed"
                size="xs"
                transform="uppercase"
                weight={700}
                mb="xs"
              >
                Builder
              </Text>
              <UsersStack
                data={
                  selected?.builder &&
                  JSON.parse(selected?.builder).map((u: any) => {
                    const user = users.find((us: any) => us.uid == u.user);
                    return {
                      avatar: `https://mc-heads.net/avatar/${user.username}`,
                      name: user.username,
                      role: "Builder",
                      data: [{ text: u.priority, description: "Priority" }],
                      menu: (
                        <Tooltip label="Change Role" withinPortal>
                          <ActionIcon
                            variant="outline"
                            color="primary"
                            onClick={() =>
                              handleBuilder(selected, u.user, false)
                            }
                          >
                            <IconSwitchVertical size={16} />
                          </ActionIcon>
                        </Tooltip>
                      ),
                    };
                  })
                }
              />
            </>
          )}
          {selected?.requests != "[]" && (
            <>
              <Text
                color="dimmed"
                size="xs"
                transform="uppercase"
                weight={700}
                mb="xs"
              >
                Requests
              </Text>
              <UsersStack
                data={
                  selected?.requests &&
                  JSON.parse(selected?.requests).map((u: any) => {
                    const user = users.find((us: any) => us.uid == u.user);
                    return {
                      avatar: `https://mc-heads.net/avatar/${user.username}`,
                      name: user.username,
                      role: "Requester",
                      data: [{ text: u.priority, description: "Priority" }],
                      menu: (
                        <Tooltip label="Change Role" withinPortal>
                          <ActionIcon
                            variant="outline"
                            color="primary"
                            onClick={() =>
                              handleBuilder(selected, u.user, true)
                            }
                          >
                            <IconSwitchVertical size={16} />
                          </ActionIcon>
                        </Tooltip>
                      ),
                    };
                  })
                }
              />
            </>
          )}
          <Group mt="md">
            <Button
              disabled={selected?.done || selected?.builder != "[]"}
              onClick={() =>
                handleRequest(
                  selected,
                  selected?.requests
                    ? !JSON.parse(selected.requests).some(
                        (d: any) => user?.uid == d.user
                      )
                    : true
                )
              }
            >
              {(
                selected?.requests
                  ? JSON.parse(selected.requests).some(
                      (d: any) => user?.uid == d.user
                    )
                  : false
              )
                ? "Unrequest"
                : "Request"}
            </Button>
            <Select
              placeholder="Priority"
              disabled={
                !(selected?.requests
                  ? JSON.parse(selected.requests).some(
                      (d: any) => user?.uid == d.user
                    )
                  : true)
              }
              value={JSON.parse(selected?.requests || "[]")
                .find((r: any) => user?.uid == r.user)
                ?.priority.toString()}
              onChange={(e: any) => handlePriority(selected, parseInt(e))}
              data={[
                { value: "1", label: "High" },
                { value: "2", label: "Normal" },
                { value: "3", label: "Low" },
              ]}
            />
          </Group>
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
            value={data?.filter((d: any) => getLandmarkStatus(d) >= 4).length}
            title={"Landmarks"}
            max={data?.filter((d: any) => getLandmarkStatus(d) > 0).length}
            descriptor="open Landmarks finished"
          ></ProgressCard>
        </div>
        <Map
          themeControls={false}
          onMapLoaded={async (map: any) => {
            mapHoverEffect(map, "blocks-layer", "blocks", (f) => f.name);
            mapClickEvent(map, "blocks-layer", (f) => {
              setSelected(f.properties);
              setEditOpen(true);
            });
            mapCopyCoordinates(map, clipboard);
          }}
          layerSetup={async (map: any) => {
            const blocks = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/v1/map?landmarks=true`
            );
            mapLoadGeoJson(
              map,
              `${process.env.NEXT_PUBLIC_API_URL}/v1/map?landmarks=true`,
              "blocks-layer",
              "circle",
              "blocks",
              {
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
              }
            );
          }}
        />
      </div>
    </Page>
  );
};

export default Landmarks;
