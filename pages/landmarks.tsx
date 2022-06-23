import {
  Badge,
  Button,
  Grid,
  Group,
  Paper,
  ScrollArea,
  Table,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import useSWR, { mutate } from "swr";
import { Check, Cross } from "tabler-icons-react";
import Map from "../components/Map";
import Page from "../components/Page";
import useUser from "../utils/hooks/useUser";
import { Permissions } from "../utils/hooks/usePermission";

const LandmarksPage = () => {
  const [user] = useUser();
  const { data } = useSWR("/api/landmarks/get");
  const { data: users } = useSWR("/api/users/get");

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
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Landmarks
            </Text>
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
                  {data
                    ? data?.map((landmark: any) => (
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
                                        users.find((e: any) => e.username === u)
                                          .uid
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
                                        users.find((e: any) => e.username === u)
                                          .uid
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
              components={data?.map((landmark: any) => ({
                type: "circle",
                center: landmark.location,
                options: {
                  color: landmark.completed ? "#37B24DFF" : "#F03E3EFF",
                  opacity: 1,
                },
                radius: 15,
                tooltip: landmark.name,
                eventHandlers: {},
              }))}
            />
          </Paper>
        </Grid.Col>
      </Grid>
    </Page>
  );
};

export default LandmarksPage;
