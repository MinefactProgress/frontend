import {
  ActionIcon,
  Badge,
  Button,
  Grid,
  Group,
  MediaQuery,
  Paper,
  ScrollArea,
  Table,
  Text,
  TextInput,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { Check, Cross, X } from "tabler-icons-react";
import useSWR, { mutate } from "swr";

import Map from "../components/Map";
import Page from "../components/Page";
import { Permissions } from "../utils/hooks/usePermission";
import {
  statusToNameLandmark,
  statusToColorNameLandmark,
} from "../utils/blockUtils";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import useUser from "../utils/hooks/useUser";
import { useRouter } from "next/router";

interface landmark {
  id: number;
  name: string;
  block: number;
  completed: boolean;
  requests: string[];
  builder: string[];
  completionDate: string;
  location: string[];
}

const LandmarksPage = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<number | null | undefined>(
    undefined
  );
  if (router.query.f && statusFilter === null) {
    setStatusFilter(parseInt(router.query.f as string));
  }
  const [user] = useUser();
  const { data } = useSWR("/api/landmarks/get");
  const { data: users } = useSWR("/api/users/get");
  const [selected, setSelected] = useState<landmark | null>(null);
  const theme = useMantineTheme();

  const getLandmarkStatus = (landmark: landmark | null) => {
    if (landmark === null) {
      return null;
    } else if (landmark.completed) {
      return 3;
    } else if (landmark.builder.length > 0) {
      return 2;
    } else if (landmark.requests.length > 0) {
      return 1;
    } else {
      return 0;
    }
  };

  const handleRequest = (landmark: any) => {
    fetch(
      process.env.NEXT_PUBLIC_API_URL +
        "/api/landmarks/edit?key=" +
        user.apikey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: landmark.id,
          requestsadd: user.uid,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          showNotification({
            title: "Error appliying Landmark",
            message: res.message,
            color: "red",
            icon: <Cross />,
          });
        } else {
          showNotification({
            title: "Applied for Landmark",
            message: "You applied to build the Landmark " + landmark.name + "!",
            color: "green",
            icon: <Check />,
          });
          mutate("/api/landmarks/get");
        }
      });
  };
  const handleUnrequest = (landmark: any) => {
    fetch(
      process.env.NEXT_PUBLIC_API_URL +
        "/api/landmarks/edit?key=" +
        user.apikey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: landmark.id,
          requestsremove: user.uid,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          showNotification({
            title: "Error unapplying Landmark",
            message: res.message,
            color: "red",
            icon: <Cross />,
          });
        } else {
          showNotification({
            title: "Unapplied for Landmark",
            message:
              "You unapplied to build the Landmark " + landmark.name + "!",
            color: "green",
            icon: <Check />,
          });
          mutate("/api/landmarks/get");
        }
      });
  };
  const handleAddBuilder = (landmark: any, userID: number) => {
    if ((user.permission || 0) < Permissions.Moderator) return;

    fetch(
      process.env.NEXT_PUBLIC_API_URL +
        "/api/landmarks/edit?key=" +
        user.apikey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: landmark.id,
          builderadd: userID,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          showNotification({
            title: "Error adding Builder",
            message: res.message,
            color: "red",
            icon: <Cross />,
          });
        } else {
          showNotification({
            title: "Builder added",
            message:
              "Builder added successfully for Landmark " + landmark.name + "!",
            color: "green",
            icon: <Cross />,
          });
          mutate("/api/landmarks/get");
        }
      });
  };
  const handleRemoveBuilder = (landmark: any, userID: number) => {
    if ((user.permission || 0) < Permissions.Moderator) return;

    fetch(
      process.env.NEXT_PUBLIC_API_URL +
        "/api/landmarks/edit?key=" +
        user.apikey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: landmark.id,
          builderremove: userID,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          showNotification({
            title: "Error removing Builder",
            message: res.message,
            color: "red",
            icon: <Cross />,
          });
        } else {
          showNotification({
            title: "Builder removed",
            message:
              "Builder removed successfully for Landmark " +
              landmark.name +
              "!",
            color: "green",
            icon: <Cross />,
          });
          mutate("/api/landmarks/get");
        }
      });
  };

  return (
    <Page title="Claim Landmarks">
      <Grid>
        <Grid.Col sm={8}>
          <Paper withBorder radius="md" p="xs">
            <div style={{ width: "100%" }}>
              <Text
                color="dimmed"
                size="xs"
                transform="uppercase"
                weight={700}
                style={{ display: "inline-block" }}
              >
                Landmarks
              </Text>
              <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
                <Group style={{ float: "right" }}>
                  <Text
                    color="dimmed"
                    size="xs"
                    transform="uppercase"
                    weight={700}
                  >
                    Filter
                  </Text>
                  {user.uid > 0 ? (
                    <Badge
                      variant={statusFilter === 4 ? "filled" : "outline"}
                      onClick={(e: any) => {
                        setStatusFilter(4);
                        router.push("/landmarks?f=4");
                      }}
                    >
                      My Claims
                    </Badge>
                  ) : null}
                  {[3, 2, 1, 0].map((status) => (
                    <Badge
                      key={status}
                      color={statusToColorNameLandmark(status)}
                      variant={statusFilter === status ? "filled" : "outline"}
                      onClick={(e: any) => {
                        setStatusFilter(status);
                        if (getLandmarkStatus(selected) !== status) {
                          setSelected(null);
                        }
                        router.push("/landmarks?f=" + status);
                      }}
                    >
                      {statusToNameLandmark(status)}
                    </Badge>
                  ))}
                  {statusFilter !== undefined ? (
                    <Tooltip
                      label="Clear Filter"
                      placement="end"
                      withArrow
                      position="bottom"
                    >
                      <ActionIcon
                        size="xs"
                        radius="xl"
                        variant="outline"
                        onClick={() => {
                          setStatusFilter(undefined);
                          router.push("/landmarks");
                        }}
                      >
                        <X size={16} />
                      </ActionIcon>
                    </Tooltip>
                  ) : null}
                </Group>
              </MediaQuery>
            </div>
            <ScrollArea style={{ height: "75vh" }}>
              <Table highlightOnHover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Builder</th>
                    <th>Requesters</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selected && (
                    <tr
                      key={selected.id}
                      style={{
                        backgroundColor:
                          theme.colorScheme == "dark"
                            ? theme.colors.dark[4]
                            : theme.colors.gray[2],
                      }}
                    >
                      <td width="20%">{selected.name}</td>
                      <td>
                        {selected.completed ? (
                          <Badge color="green">Done</Badge>
                        ) : selected.builder.length > 0 ? (
                          <Badge color="orange">Claimed</Badge>
                        ) : selected.requests.length > 0 ? (
                          <Badge color="cyan">Requested</Badge>
                        ) : (
                          <Badge color="red">Not Claimed</Badge>
                        )}
                      </td>
                      <td>
                        {selected.builder.length > 0 ? (
                          <Group>
                            {selected.builder.map((u: any) => (
                              <Badge
                                key={u}
                                variant="outline"
                                onClick={() =>
                                  handleRemoveBuilder(
                                    selected,
                                    users.find((e: any) => e.username === u).uid
                                  )
                                }
                              >
                                {u}
                              </Badge>
                            ))}
                          </Group>
                        ) : (
                          "---"
                        )}
                      </td>
                      <td>
                        {selected.requests.length > 0 ? (
                          <Group>
                            {selected.requests.map((u: any) => (
                              <Badge
                                key={u}
                                variant="outline"
                                onClick={() =>
                                  handleAddBuilder(
                                    selected,
                                    users.find((e: any) => e.username === u).uid
                                  )
                                }
                              >
                                {u}
                              </Badge>
                            ))}
                          </Group>
                        ) : (
                          "---"
                        )}
                      </td>
                      <td>
                        {selected.requests.includes(user?.username || "d") ? (
                          <Button
                            color="red"
                            disabled={
                              selected.completed || selected.builder.length > 0
                            }
                            onClick={() => handleUnrequest(selected)}
                          >
                            Unapply
                          </Button>
                        ) : (
                          <Button
                            color="green"
                            disabled={
                              selected.completed || selected.builder.length > 0
                            }
                            onClick={() => handleRequest(selected)}
                          >
                            Apply
                          </Button>
                        )}
                      </td>
                    </tr>
                  )}
                  {data
                    ? data
                        ?.filter((landmark: any) => {
                          switch (statusFilter) {
                            case 0:
                              return (
                                landmark.requests.length === 0 &&
                                landmark.builder.length === 0 &&
                                !landmark.completed
                              );
                            case 1:
                              return (
                                landmark.requests.length > 0 &&
                                landmark.builder.length === 0 &&
                                !landmark.completed
                              );
                            case 2:
                              return (
                                landmark.builder.length > 0 &&
                                !landmark.completed
                              );
                            case 3:
                              return landmark.completed;
                            case 4:
                              return (
                                landmark.builder.includes(user.username) ||
                                landmark.requests.includes(user.username)
                              );
                            default:
                              return true;
                          }
                        })
                        .map((landmark: any) => (
                          <tr key={landmark.id}>
                            <td width="20%">{landmark.name}</td>
                            <td>
                              {landmark.completed ? (
                                <Badge color="green">Done</Badge>
                              ) : landmark.builder.length > 0 ? (
                                <Badge color="orange">Claimed</Badge>
                              ) : landmark.requests.length > 0 ? (
                                <Badge color="cyan">Requested</Badge>
                              ) : (
                                <Badge color="red">Not Claimed</Badge>
                              )}
                            </td>
                            <td>
                              {landmark.builder.length > 0 ? (
                                <Group>
                                  {landmark.builder.map((u: any) => (
                                    <Badge
                                      key={u}
                                      variant="outline"
                                      onClick={() =>
                                        handleRemoveBuilder(
                                          landmark,
                                          users.find(
                                            (e: any) => e.username === u
                                          ).uid
                                        )
                                      }
                                    >
                                      {u}
                                    </Badge>
                                  ))}
                                </Group>
                              ) : (
                                "---"
                              )}
                            </td>
                            <td>
                              {landmark.requests.length > 0 ? (
                                <Group>
                                  {landmark.requests.map((u: any) => (
                                    <Badge
                                      key={u}
                                      variant="outline"
                                      onClick={() =>
                                        handleAddBuilder(
                                          landmark,
                                          users.find(
                                            (e: any) => e.username === u
                                          ).uid
                                        )
                                      }
                                    >
                                      {u}
                                    </Badge>
                                  ))}
                                </Group>
                              ) : (
                                "---"
                              )}
                            </td>
                            <td>
                              {landmark.requests.includes(user?.username) ? (
                                <Button
                                  color="red"
                                  disabled={
                                    landmark.completed ||
                                    landmark.builder.length > 0
                                  }
                                  onClick={() => handleUnrequest(landmark)}
                                >
                                  Unapply
                                </Button>
                              ) : (
                                <Button
                                  color="green"
                                  disabled={
                                    landmark.completed ||
                                    landmark.builder.length > 0
                                  }
                                  onClick={() => handleRequest(landmark)}
                                >
                                  Apply
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))
                    : null}
                </tbody>
              </Table>
            </ScrollArea>
          </Paper>
        </Grid.Col>
        <Grid.Col sm={4}>
          <Paper
            withBorder
            radius="md"
            p="xs"
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Map
            </Text>
            <Map
              width="100%"
              height="97%"
              style={{ zIndex: 10 }}
              zoom={12}
              components={data
                ?.filter((landmark: any) => {
                  switch (statusFilter) {
                    case 0:
                      return (
                        landmark.requests.length === 0 &&
                        landmark.builder.length === 0 &&
                        !landmark.completed
                      );
                    case 1:
                      return (
                        landmark.requests.length > 0 &&
                        landmark.builder.length === 0 &&
                        !landmark.completed
                      );
                    case 2:
                      return landmark.builder.length > 0 && !landmark.completed;
                    case 3:
                      return landmark.completed;
                    case 4:
                      return (
                        landmark.builder.includes(user.username) ||
                        landmark.requests.includes(user.username)
                      );
                    default:
                      return true;
                  }
                })
                .map((landmark: any) => ({
                  type: "circle",
                  center: landmark.location,
                  options: {
                    color:
                      landmark.requests.length > 0
                        ? landmark.builder.length > 0
                          ? theme.colors.green[7]
                          : theme.colors.cyan[7]
                        : theme.colors.red[7],
                    opacity: selected
                      ? selected.id == landmark.id
                        ? 1
                        : 0.05
                      : 0.5,
                  },
                  radius: 15,
                  tooltip: landmark.name,
                  eventHandlers: {
                    click: () => {
                      setSelected(landmark);
                    },
                  },
                }))}
            />
          </Paper>
        </Grid.Col>
      </Grid>
    </Page>
  );
};

export default LandmarksPage;