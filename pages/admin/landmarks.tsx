import {
  ActionIcon,
  Button,
  Center,
  Grid,
  Group,
  NumberInput,
  Paper,
  ScrollArea,
  Select,
  Table,
  Text,
  TextInput,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import {
  Check,
  CircleOff,
  Cross,
  Edit,
  Hash,
  MapPins,
  Notes,
  Trash,
} from "tabler-icons-react";

import Page from "../../components/Page";
import Map from "../../components/Map";
import { useForm } from "@mantine/form";
import { useModals } from "@mantine/modals";
import useSWR, { mutate } from "swr";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import useUser from "../../utils/hooks/useUser";

const LandmarksPage = () => {
  const theme = useMantineTheme();
  const modals = useModals();
  const [user] = useUser();
  const { data } = useSWR("/api/landmarks/get");
  const { data: districts } = useSWR("/api/districts/get");
  const [selLandmark, setSelLandmark] = useState<any>(null);

  const createForm = useForm({
    initialValues: {
      name: "",
      district: "",
      blockID: "",
      location: "",
    },
  });

  const handleClick = (id: number) => {
    setSelLandmark(data?.find((l: any) => l.id === id));
  };
  const handleAddLandmark = async (e: any) => {
    const result = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        "/api/landmarks/create?key=" +
        user.apikey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(createForm.values),
      }
    ).then((res) => res.json());
    if (result.error) {
      showNotification({
        autoClose: 5000,
        title: "Error creating landmark",
        message: result.message,
        color: "red",
        icon: <Cross />,
      });
    } else {
      createForm.reset();
      showNotification({
        autoClose: 5000,
        title: "Landmark created",
        message:
          "The landmark " +
          result.data.name +
          " has been created successfully.",
        color: "green",
        icon: <Check />,
      });
      mutate("/api/landmarks/get");
    }
  };
  const handleDeleteLandmark = (id: number) => {
    const landmark = data?.find((l: any) => l.id === id);
    modals.openConfirmModal({
      title: "Do you want to delete this landmark?",
      centered: true,
      children: (
        <Text size="sm">
          You will delete <b>{landmark.name}</b>.
          <br />
          All Claims and Progress of this landmark will be deleted!
        </Text>
      ),
      labels: { confirm: "Delete landmark", cancel: "Cancel Deletion" },
      confirmProps: { color: "red" },
      onCancel: () => {
        showNotification({
          title: "Deletion cancelled",
          message: "The landmark was not deleted",
          icon: <Cross />,
        });
      },
      onConfirm: async () => {
        const result = await fetch(
          process.env.NEXT_PUBLIC_API_URL +
            "/api/landmarks/delete?key=" +
            user.apikey,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
              id: landmark.id,
            }),
          }
        ).then((res) => res.json());
        if (result.error) {
          showNotification({
            autoClose: 5000,
            title: "Error deleting landmark",
            message: result.message,
            color: "red",
            icon: <Cross />,
          });
        } else {
          showNotification({
            autoClose: 5000,
            title: "Landmark deleted",
            message:
              "The landmark " +
              landmark.name +
              " has been deleted successfully.",
            color: "green",
            icon: <Check />,
          });
          mutate("/api/landmarks/get");
        }
      },
    });
  };
  const handleEditLandmark = (event: any) => {
    event.preventDefault();
    if (
      selLandmark &&
      selLandmark != data?.find((l: any) => l.id === selLandmark?.id)
    ) {
      fetch(
        process.env.NEXT_PUBLIC_API_URL +
          "/api/landmarks/edit?key=" +
          user.apikey,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selLandmark?.id,
            name: selLandmark?.name,
            weight: selLandmark?.weight,
            location: selLandmark?.location.join(","),
          }),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            showNotification({
              title: "Error updating Landmark",
              message: res.message,
              color: "red",
              icon: <Cross />,
            });
          } else {
            showNotification({
              title: "Landmark updated",
              message: "The data of " + selLandmark?.name + " has been updated",
              color: "green",
              icon: <Check />,
            });
            mutate("/api/landmarks/get");
          }
        });
    } else {
      showNotification({
        title: "Nothing changed",
        message: "No changed were made to the landmark",
      });
    }
  };

  return (
    <Page title="Manage Landmarks">
      <Grid>
        <Grid.Col sm={8}>
          <Paper
            withBorder
            radius="md"
            p="xs"
            style={{
              marginBottom: theme.spacing.md,
            }}
          >
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Create new Landmark
            </Text>
            <form onSubmit={createForm.onSubmit(handleAddLandmark)}>
              <Group grow>
                <TextInput
                  label="Name"
                  name="name"
                  placeholder="Name"
                  required
                  {...createForm.getInputProps("name")}
                />
                <Select
                  label="District"
                  name="district"
                  placeholder="District"
                  required
                  searchable
                  data={
                    districts
                      ? districts
                          ?.filter(
                            (district: any) =>
                              !districts.some(
                                (d: any) => d.parent === district.id
                              )
                          )
                          .map((district: any) => {
                            const filter = districts?.filter(
                              (d: any) => d.name === district.name
                            );
                            if (filter.length > 1) {
                              return {
                                value: district.id,
                                label: `${district.name} (${
                                  districts?.find(
                                    (d: any) => d.id === district.parent
                                  ).name
                                })`,
                              };
                            } else {
                              return {
                                value: district.id,
                                label: district.name,
                              };
                            }
                          })
                          .sort((a: any, b: any) =>
                            a.label.localeCompare(b.label)
                          )
                      : null
                  }
                  {...createForm.getInputProps("district")}
                />
                <NumberInput
                  label="Block ID"
                  name="blockid"
                  placeholder="Block ID"
                  required
                  min={1}
                  {...createForm.getInputProps("blockID")}
                />
                <TextInput
                  label="Location"
                  name="location"
                  placeholder="Location"
                  required
                  {...createForm.getInputProps("location")}
                />
                <Button
                  type="submit"
                  size="sm"
                  mt="xs"
                  color="green"
                  style={{ width: "16%", marginTop: 25 }}
                >
                  Create
                </Button>
              </Group>
            </form>
          </Paper>
          <Paper withBorder radius="md" p="xs">
            <div style={{ width: "100%" }}>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                Landmarks
              </Text>
              <ScrollArea style={{ height: "72vh" }}>
                {data?.length > 0 ? (
                  <Table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Block</th>
                        <th>Location</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {data
                        ? data.map((landmark: any) => (
                            <tr key={landmark.id}>
                              <td>{landmark.id}</td>
                              <td>{landmark.name}</td>
                              <td>{landmark.block}</td>
                              <td>{landmark.location.join(",")}</td>
                              <td>
                                <Group>
                                  <Tooltip label="Edit" withArrow>
                                    <ActionIcon
                                      onClick={(e: any) =>
                                        handleClick(landmark.id)
                                      }
                                    >
                                      <Edit size={20} />
                                    </ActionIcon>
                                  </Tooltip>
                                  <Tooltip label="Delete" withArrow>
                                    <ActionIcon
                                      onClick={() =>
                                        handleDeleteLandmark(landmark.id)
                                      }
                                      variant="transparent"
                                    >
                                      <Trash size={20} color="red" />
                                    </ActionIcon>
                                  </Tooltip>
                                </Group>
                              </td>
                            </tr>
                          ))
                        : null}
                    </tbody>
                  </Table>
                ) : (
                  <Center>
                    <CircleOff
                      size={18}
                      color="red"
                      style={{ marginTop: theme.spacing.md }}
                    />
                    <Text style={{ marginTop: theme.spacing.md }}>
                      &nbsp;No Landmarks found
                    </Text>
                  </Center>
                )}
              </ScrollArea>
            </div>
          </Paper>
        </Grid.Col>
        <Grid.Col sm={4}>
          <Paper
            withBorder
            radius="md"
            p="xs"
            style={{
              height: "48%",
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
                tooltip: `Landmark #${landmark.id} | ${landmark.name}`,
                eventHandlers: {},
              }))}
            />
          </Paper>
          <Paper
            withBorder
            radius="md"
            p="xs"
            style={{
              height: "50%",
              width: "100%",
              marginBottom: theme.spacing.md,
            }}
          >
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Edit Landmark
            </Text>
            <form onSubmit={handleEditLandmark}>
              <NumberInput
                label="ID"
                name="id"
                placeholder="ID"
                min={1}
                max={data?.length}
                icon={<Hash size={18} />}
                value={selLandmark?.id}
                onChange={handleClick}
              />
              <TextInput
                label="Name"
                name="name"
                placeholder="Name"
                icon={<Notes size={18} />}
                value={selLandmark?.name}
                onChange={(e: any) => {
                  setSelLandmark({
                    ...selLandmark,
                    name: e.currentTarget.value,
                  });
                }}
              />
              <TextInput
                label="Location"
                name="location"
                placeholder="Location"
                icon={<MapPins size={18} />}
                value={selLandmark?.location}
                onChange={(e: any) => {
                  setSelLandmark({
                    ...selLandmark,
                    location: e.currentTarget.value,
                  });
                }}
              />
              <Button
                type="submit"
                fullWidth
                style={{ marginTop: theme.spacing.md }}
              >
                Update Landmark
              </Button>
            </form>
          </Paper>
        </Grid.Col>
      </Grid>
    </Page>
  );
};

export default LandmarksPage;
