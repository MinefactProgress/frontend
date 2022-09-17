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
import {
  Check,
  CircleCheck,
  Clock,
  Cross,
  Number1,
  Number2,
  Number3,
  UserPlus,
  X,
} from "tabler-icons-react";
import {
  statusToColorNameLandmark,
  statusToNameLandmark,
} from "../utils/blockUtils";
import useSWR, { mutate } from "swr";

import Map from "../components/Map";
import Page from "../components/Page";
import { Permissions } from "../utils/hooks/usePermission";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useState } from "react";
import useUser from "../utils/hooks/useUser";

interface landmark {
  id: number;
  name: string;
  block: number;
  completed: boolean;
  requests: any[];
  builder: string[];
  completionDate: string;
  location: string[];
}

const LandmarksPage = () => {
  const theme = useMantineTheme();
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
  const handleEditPriority = (landmark: any, e: any) => {
    fetch(
      process.env.NEXT_PUBLIC_API_URL +
        "/api/landmarks/edit?key=" +
        user.apikey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: landmark.id,
          priority: {
            user: user.uid,
            priority: parseInt(e),
          },
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          showNotification({
            title: "Error updating priority",
            message: res.message,
            color: "red",
            icon: <Cross />,
          });
        } else {
          showNotification({
            title: "Updated priority",
            message:
              "You changed your priority of " + landmark.name + " to " + e,
            color: "green",
            icon: <Check />,
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
                  <Badge
                    color="violet"
                    variant={statusFilter === 5 ? "filled" : "outline"}
                    onClick={(e: any) => {
                      setStatusFilter(5);
                      router.push("/landmarks?f=5");
                    }}
                  >
                    Not Available
                  </Badge>
                  {statusFilter !== undefined ? (
                    <Tooltip
                      label="Clear Filter"position="bottom-end"
                      withArrow
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
            <Tabs defaultValue="claimable">
              <Tabs.List>
                <Tabs.Tab value="claimable" icon={<UserPlus size={16} />}>
                  Claimable Landmarks
                </Tabs.Tab>
                <Tabs.Tab value="future" icon={<Clock size={16} />}>
                  Future Landmarks
                </Tabs.Tab>
                <Tabs.Tab value="completed" icon={<CircleCheck size={16} />}>
                  Completed Landmarks
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="claimable">
                <ScrollArea style={{ height: "79vh" }}>
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
                                    key={u.user}
                                    variant="outline"
                                    onClick={() =>
                                      handleRemoveBuilder(
                                        selected,
                                        users.find(
                                          (e: any) => e.username === u.user
                                        ).uid
                                      )
                                    }
                                  >
                                    {u.user}
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
                                    key={u.user}
                                    variant="outline"
                                    onClick={() =>
                                      handleAddBuilder(
                                        selected,
                                        users.find(
                                          (e: any) => e.username === u.user
                                        ).uid
                                      )
                                    }
                                  >
                                    {u.user}
                                  </Badge>
                                ))}
                              </Group>
                            ) : (
                              "---"
                            )}
                          </td>
                          <td>
                            {selected.requests.some(
                              (r: any) => r.user === user?.username
                            ) ? (
                              <Button
                                color="red"
                                disabled={
                                  selected.completed ||
                                  selected.builder.length > 0
                                }
                                onClick={() => handleUnrequest(selected)}
                              >
                                Unapply
                              </Button>
                            ) : (
                              <Button
                                color="green"
                                disabled={
                                  selected.completed ||
                                  selected.builder.length > 0
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
                              if (!landmark.enabled || landmark.completed) {
                                return false;
                              }
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
                                    landmark.builder.some(
                                      (b: any) => b.user === user?.username
                                    ) ||
                                    landmark.requests.some(
                                      (r: any) => r.user === user?.username
                                    )
                                  );
                                case 5:
                                  return !landmark.enabled;
                                default:
                                  return true;
                              }
                            })
                            .sort((a: any, b: any) =>
                              a.name.localeCompare(b.name)
                            )
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
                                          key={u.user}
                                          variant="outline"
                                          onClick={() =>
                                            handleRemoveBuilder(
                                              landmark,
                                              users.find(
                                                (e: any) =>
                                                  e.username === u.user
                                              ).uid
                                            )
                                          }
                                        >
                                          {u.user}
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
                                          key={u.user}
                                          variant="outline"
                                          leftSection={
                                            <div style={{ paddingTop: 5 }}>
                                              {u.priority === 1 ? (
                                                <Number1
                                                  size={18}
                                                  color={theme.colors.red[7]}
                                                />
                                              ) : u.priority === 2 ? (
                                                <Number2
                                                  size={18}
                                                  color={theme.colors.yellow[5]}
                                                />
                                              ) : (
                                                <Number3
                                                  size={18}
                                                  color={theme.colors.green[7]}
                                                />
                                              )}
                                            </div>
                                          }
                                          sx={{ paddingLeft: 3 }}
                                          onClick={() =>
                                            handleAddBuilder(
                                              landmark,
                                              users.find(
                                                (e: any) =>
                                                  e.username === u.user
                                              ).uid
                                            )
                                          }
                                        >
                                          {u.user}
                                        </Badge>
                                      ))}
                                    </Group>
                                  ) : (
                                    "---"
                                  )}
                                </td>
                                <td width="25%">
                                  {landmark.requests.some(
                                    (r: any) => r.user === user?.username
                                  ) ? (
                                    <Group>
                                      <Button
                                        color="red"
                                        disabled={
                                          landmark.completed ||
                                          landmark.builder.length > 0
                                        }
                                        onClick={() =>
                                          handleUnrequest(landmark)
                                        }
                                      >
                                        Unapply
                                      </Button>
                                      <Select
                                        style={{ width: "40%" }}
                                        disabled={landmark.builder.some(
                                          (b: any) => b.user === user?.username
                                        )}
                                        value={`${
                                          landmark.requests.find(
                                            (r: any) =>
                                              r.user === user?.username
                                          ).priority
                                        }`}
                                        data={[
                                          { value: "1", label: "High" },
                                          { value: "2", label: "Normal" },
                                          { value: "3", label: "Low" },
                                        ]}
                                        onChange={(e: any) =>
                                          handleEditPriority(landmark, e)
                                        }
                                      />
                                    </Group>
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
              </Tabs.Panel>
              <Tabs.Panel value="future">
                <ScrollArea style={{ height: "79vh" }}>
                  <Table highlightOnHover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Builder</th>
                        <th>Requesters</th>
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
                            <Badge color="violet">Not available</Badge>
                          </td>
                          <td>
                            {selected.builder.length > 0 ? (
                              <Group>
                                {selected.builder.map((u: any) => (
                                  <Badge
                                    key={u.user}
                                    variant="outline"
                                    onClick={() =>
                                      handleRemoveBuilder(
                                        selected,
                                        users.find(
                                          (e: any) => e.username === u.user
                                        ).uid
                                      )
                                    }
                                  >
                                    {u.user}
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
                                    key={u.user}
                                    variant="outline"
                                    onClick={() =>
                                      handleAddBuilder(
                                        selected,
                                        users.find(
                                          (e: any) => e.username === u.user
                                        ).uid
                                      )
                                    }
                                  >
                                    {u.user}
                                  </Badge>
                                ))}
                              </Group>
                            ) : (
                              "---"
                            )}
                          </td>
                        </tr>
                      )}
                      {data
                        ? data
                            ?.filter((landmark: any) => {
                              if (landmark.enabled) {
                                return false;
                              }
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
                                    landmark.builder.some(
                                      (b: any) => b.user === user?.username
                                    ) ||
                                    landmark.requests.some(
                                      (r: any) => r.user === user?.username
                                    )
                                  );
                                case 5:
                                  return !landmark.enabled;
                                default:
                                  return true;
                              }
                            })
                            .sort((a: any, b: any) =>
                              a.name.localeCompare(b.name)
                            )
                            .map((landmark: any) => (
                              <tr key={landmark.id}>
                                <td width="20%">{landmark.name}</td>
                                <td>
                                  <Badge color="violet">Not available</Badge>
                                </td>
                                <td>
                                  {landmark.builder.length > 0 ? (
                                    <Group>
                                      {landmark.builder.map((u: any) => (
                                        <Badge
                                          key={u.user}
                                          variant="outline"
                                          onClick={() =>
                                            handleRemoveBuilder(
                                              landmark,
                                              users.find(
                                                (e: any) =>
                                                  e.username === u.user
                                              ).uid
                                            )
                                          }
                                        >
                                          {u.user}
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
                                          key={u.user}
                                          variant="outline"
                                          leftSection={
                                            <div style={{ paddingTop: 5 }}>
                                              {u.priority === 1 ? (
                                                <Number1
                                                  size={18}
                                                  color={theme.colors.red[7]}
                                                />
                                              ) : u.priority === 2 ? (
                                                <Number2
                                                  size={18}
                                                  color={theme.colors.yellow[5]}
                                                />
                                              ) : (
                                                <Number3
                                                  size={18}
                                                  color={theme.colors.green[7]}
                                                />
                                              )}
                                            </div>
                                          }
                                          sx={{ paddingLeft: 3 }}
                                          onClick={() =>
                                            handleAddBuilder(
                                              landmark,
                                              users.find(
                                                (e: any) =>
                                                  e.username === u.user
                                              ).uid
                                            )
                                          }
                                        >
                                          {u.user}
                                        </Badge>
                                      ))}
                                    </Group>
                                  ) : (
                                    "---"
                                  )}
                                </td>
                              </tr>
                            ))
                        : null}
                    </tbody>
                  </Table>
                </ScrollArea>
              </Tabs.Panel>
              <Tabs.Panel value="completed">
                <ScrollArea style={{ height: "79vh" }}>
                  <Table highlightOnHover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Builder</th>
                        <th>Requesters</th>
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
                            <Badge color="green">Done</Badge>
                          </td>
                          <td>
                            {selected.builder.length > 0 ? (
                              <Group>
                                {selected.builder.map((u: any) => (
                                  <Badge
                                    key={u.user}
                                    variant="outline"
                                    onClick={() =>
                                      handleRemoveBuilder(
                                        selected,
                                        users.find(
                                          (e: any) => e.username === u.user
                                        ).uid
                                      )
                                    }
                                  >
                                    {u.user}
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
                                    key={u.user}
                                    variant="outline"
                                    onClick={() =>
                                      handleAddBuilder(
                                        selected,
                                        users.find(
                                          (e: any) => e.username === u.user
                                        ).uid
                                      )
                                    }
                                  >
                                    {u.user}
                                  </Badge>
                                ))}
                              </Group>
                            ) : (
                              "---"
                            )}
                          </td>
                        </tr>
                      )}
                      {data
                        ? data
                            ?.filter((landmark: any) => {
                              if (!landmark.completed) {
                                return false;
                              }
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
                                    landmark.builder.some(
                                      (b: any) => b.user === user?.username
                                    ) ||
                                    landmark.requests.some(
                                      (r: any) => r.user === user?.username
                                    )
                                  );
                                case 5:
                                  return !landmark.enabled;
                                default:
                                  return true;
                              }
                            })
                            .sort((a: any, b: any) =>
                              a.name.localeCompare(b.name)
                            )
                            .map((landmark: any) => (
                              <tr key={landmark.id}>
                                <td width="20%">{landmark.name}</td>
                                <td>
                                  <Badge color="green">Done</Badge>
                                </td>
                                <td>
                                  {landmark.builder.length > 0 ? (
                                    <Group>
                                      {landmark.builder.map((u: any) => (
                                        <Badge
                                          key={u.user}
                                          variant="outline"
                                          onClick={() =>
                                            handleRemoveBuilder(
                                              landmark,
                                              users.find(
                                                (e: any) =>
                                                  e.username === u.user
                                              ).uid
                                            )
                                          }
                                        >
                                          {u.user}
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
                                          key={u.user}
                                          variant="outline"
                                          leftSection={
                                            <div style={{ paddingTop: 5 }}>
                                              {u.priority === 1 ? (
                                                <Number1
                                                  size={18}
                                                  color={theme.colors.red[7]}
                                                />
                                              ) : u.priority === 2 ? (
                                                <Number2
                                                  size={18}
                                                  color={theme.colors.yellow[5]}
                                                />
                                              ) : (
                                                <Number3
                                                  size={18}
                                                  color={theme.colors.green[7]}
                                                />
                                              )}
                                            </div>
                                          }
                                          sx={{ paddingLeft: 3 }}
                                          onClick={() =>
                                            handleAddBuilder(
                                              landmark,
                                              users.find(
                                                (e: any) =>
                                                  e.username === u.user
                                              ).uid
                                            )
                                          }
                                        >
                                          {u.user}
                                        </Badge>
                                      ))}
                                    </Group>
                                  ) : (
                                    "---"
                                  )}
                                </td>
                              </tr>
                            ))
                        : null}
                    </tbody>
                  </Table>
                </ScrollArea>
              </Tabs.Panel>
            </Tabs>
          </Paper>
        </Grid.Col>
        <Grid.Col sm={4}>
          <Paper
            withBorder
            radius="md"
            p="xs"
            style={{
              height: "49%",
              width: "100%",
              marginBottom: theme.spacing.md,
            }}
          >
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Map
            </Text>
            <Map
              width="100%"
              height="94%"
              defaultLayerName="Landmarks"
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
                        landmark.builder.some(
                          (b: any) => b.user === user?.username
                        ) ||
                        landmark.requests.some(
                          (r: any) => r.user === user?.username
                        )
                      );
                    case 5:
                      return !landmark.enabled;
                    default:
                      return true;
                  }
                })
                .map((landmark: any) => ({
                  type: "circle",
                  center: landmark.location,
                  options: {
                    color: !landmark.enabled
                      ? theme.colors.grape[9]
                      : landmark.completed
                      ? theme.colors.green[7]
                      : landmark.requests.length > 0
                      ? landmark.builder.length > 0
                        ? theme.colors.orange[6]
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
          <Paper
            withBorder
            radius="md"
            p="xs"
            style={{ height: "49%", marginBottom: theme.spacing.md }}
          >
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Claims & Requests
            </Text>
            <ScrollArea style={{ height: "95%" }}>
              <Table highlightOnHover>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Finished</th>
                    <th>Claims</th>
                    <th>Requests</th>
                  </tr>
                </thead>
                <tbody>
                  {requests
                    ? requests?.map((request: any) => (
                        <tr key={request.name}>
                          <td>{request.name}</td>
                          <td>{request.done}</td>
                          <td>{request.claims}</td>
                          <td>{request.requests.join(" | ")}</td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </Table>
            </ScrollArea>
          </Paper>
        </Grid.Col>
      </Grid>
    </Page>
  );
};

export default LandmarksPage;
