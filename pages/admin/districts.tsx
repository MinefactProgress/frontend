import {
  ActionIcon,
  Button,
  Divider,
  Grid,
  Group,
  Paper,
  ScrollArea,
  Select,
  Table,
  Tabs,
  Text,
  TextInput,
  ThemeIcon,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { CirclePlus, Check, Cross, Pencil, Trash } from "tabler-icons-react";

import Page from "../../components/Page";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import useSWR from "swr";
import useUser from "../../utils/hooks/useUser";

const DistrictsPage = () => {
  const theme = useMantineTheme();
  const [user] = useUser();
  const form = useForm({
    initialValues: {
      name: "",
      parent: "",
      image: "",
      map: "",
    },
  });
  const { data } = useSWR("/api/districts/get");

  const handleAddDistrict = async () => {
    const result = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        "/api/districts/create?key=" +
        user.apikey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(form.values),
      }
    ).then((res) => res.json());
    if (result.error) {
      showNotification({
        autoClose: 5000,
        title: "Error creating district",
        message: result.message,
        color: "red",
        icon: <Cross />,
      });
    } else {
      showNotification({
        autoClose: 5000,
        title: "District created",
        message:
          "The district " +
          result.data.name +
          " has been created successfully.",
        color: "green",
        icon: <Check />,
      });
    }
  };
  const handleDistrictEdit = () => {};
  const handleDistrictDelete = () => {};

  return (
    <Page title="Manage Districts">
      <Grid>
        <Grid.Col span={7}>
          <Paper withBorder radius="md" p="xs">
            <Group>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                Districts
              </Text>
            </Group>
            <ScrollArea style={{ height: "86vh" }}>
              <Table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Parent</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    ? data?.map((district: any) => (
                        <tr key={district.id}>
                          <td>{district.id}</td>
                          <td>{district.name}</td>
                          <td>
                            {district.parent
                              ? data?.filter(
                                  (d: any) => d.id === district.parent
                                )[0].name
                              : "---"}
                          </td>
                          <td>{district.image ? district.image : "---"}</td>
                          <td>
                            <Group spacing="xs">
                              <Tooltip gutter={10} label="Delete" withArrow>
                                <ActionIcon
                                  onClick={() => handleDistrictDelete()}
                                  disabled={district.id === 1}
                                >
                                  <ThemeIcon color="red">
                                    <Trash size={18} />
                                  </ThemeIcon>
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </Table>
            </ScrollArea>
          </Paper>
        </Grid.Col>
        <Grid.Col span={5}>
          <Paper withBorder radius="md" p="xs">
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              District Control
            </Text>
            <Tabs
              variant="pills"
              tabPadding="md"
              style={{ marginTop: theme.spacing.md }}
            >
              <Tabs.Tab
                label="Add new District"
                icon={<CirclePlus size={14} />}
              >
                <form onSubmit={form.onSubmit(handleAddDistrict)}>
                  <Group position="center" grow>
                    <TextInput
                      label="Name"
                      name="name"
                      placeholder="Name"
                      required
                      style={{ marginBottom: theme.spacing.md }}
                      {...form.getInputProps("name")}
                    />
                    <Select
                      label="Parent"
                      name="parent"
                      placeholder="Select Parent"
                      searchable
                      nothingFound="No options"
                      clearable
                      required
                      data={
                        data
                          ? data?.map((district: any) => {
                              const filter = data?.filter(
                                (d: any) => d.name === district.name
                              );
                              if (filter.length > 1) {
                                return {
                                  value: district.id,
                                  label: `${district.name} (${
                                    data?.filter(
                                      (d: any) => d.id === district.parent
                                    )[0].name
                                  })`,
                                };
                              } else {
                                return {
                                  value: district.id,
                                  label: district.name,
                                };
                              }
                            })
                          : null
                      }
                      style={{ marginBottom: theme.spacing.md }}
                      {...form.getInputProps("parent")}
                    />
                  </Group>
                  <Divider my="sm" />
                  <TextInput
                    label="Image"
                    name="image"
                    placeholder="Image Link"
                    style={{ marginBottom: theme.spacing.md }}
                    {...form.getInputProps("image")}
                  />

                  <Button type="submit" size="sm" mt="xs" mb="xs" fullWidth>
                    Add District
                  </Button>
                </form>
              </Tabs.Tab>
              <Tabs.Tab
                label="Edit existing District"
                icon={<Pencil size={14} />}
              ></Tabs.Tab>
            </Tabs>
          </Paper>
          <Paper
            withBorder
            radius="md"
            p="xs"
            style={{ marginTop: theme.spacing.md }}
          >
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Block Control
            </Text>
          </Paper>
        </Grid.Col>
      </Grid>
    </Page>
  );
};

export default DistrictsPage;
