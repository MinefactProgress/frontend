import {
  ActionIcon,
  Button,
  Divider,
  Grid,
  Group,
  NumberInput,
  Paper,
  ScrollArea,
  Select,
  SimpleGrid,
  Skeleton,
  Table,
  Tabs,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import {
  Check,
  Cross,
  Edit,
  Pencil,
  Trash,
  UserPlus,
} from "tabler-icons-react";

import Page from "../../components/Page";
import { getRoleFromPermission } from "../../utils/hooks/usePermission";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useState } from "react";
import useUser from "../../utils/hooks/useUser";

const UsersPage = () => {
  const PRIMARY_COL_HEIGHT = 840;
  const theme = useMantineTheme();
  const modals = useModals();
  const [user] = useUser();
  const router = useRouter();
  const [addUserOpen, setAddUserOpen] = useState(true);
  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      discord: "",
      minecraft: "",
      role: "",
      about: "",
    },

    validate: {},
  });
  const formEdit = useForm({
    initialValues: {
      uid: "",
      username: "",
      discord: "",
      minecraft: "",
      role: "",
      password: "",
      about: "",
      picture: "",
      image: "",
    },

    validate: {},
  });
  const SECONDARY_COL_HEIGHT = PRIMARY_COL_HEIGHT / 2 - theme.spacing.md / 2;
  const { data } = useSWR("http://142.44.137.53:8080/api/users/get");
  const handleDeleteUser = (id: string) => {
    const userD = data?.find((user: any) => user.uid === id);
    modals.openConfirmModal({
      title: "Do you want to delete this account?",
      centered: true,
      children: (
        <Text size="sm">
          You will delete <b>{userD.username}</b>
          &apos;s account.
          <br />
          All Claims and Statisitics will not be deleted.
          <br />
          Please message <b>{userD.discord}</b> ({userD.email}) to let them know
          you are deleting their account.
        </Text>
      ),
      labels: { confirm: "Delete Account", cancel: "Cancel Deletion" },
      confirmProps: { color: "red" },
      onCancel: () => {
        showNotification({
          title: "Deletion cancelled",
          message: "The accound was not deleted.",
          icon: <Cross />,
        });
      },
      onConfirm: async () => {
        const result = await fetch(
          "http://142.44.137.53:8080/api/users/delete?key=" + user.apikey,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
              uid: id,
            }),
          }
        ).then((res) => res.json());
        if (result.error) {
          showNotification({
            autoClose: 5000,
            title: "Error deleting account",
            message: result.message,
            color: "red",
            icon: <Cross />,
          });
        } else {
          showNotification({
            autoClose: 5000,
            title: "Account deleted",
            message:
              "The accound of " +
              userD.username +
              " has been deleted successfully. Reload to see changes.",
            color: "green",
            icon: <Check />,
          });
        }
      },
    });
  };
  const handleAddUser = async (e: any) => {
    const result = await fetch(
      "http://142.44.137.53:8080/api/users/create?key=" + user.apikey,
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
        title: "Error creating account",
        message: result.message,
        color: "red",
        icon: <Cross />,
      });
    } else {
      form.reset();
      showNotification({
        autoClose: 5000,
        title: "Account created",
        message:
          "The accound of " +
          result.data.username +
          " has been created successfully. One Time Password: " +
          result.data.password,
        color: "green",
        icon: <Check />,
      });
    }
  };
  const handleEditUser = async (e: any) => {
    const removeEmptyOrNull = (obj: any) => {
      Object.keys(obj).forEach(
        (k) =>
          (obj[k] && typeof obj[k] === "object" && removeEmptyOrNull(obj[k])) ||
          (!obj[k] && obj[k] !== undefined && delete obj[k])
      );
      return obj;
    };
    const values = removeEmptyOrNull(formEdit.values);
    const result = await fetch(
      "http://142.44.137.53:8080/api/users/update?key=" + user.apikey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ uid: formEdit.values.uid, values: values }),
      }
    ).then((res) => res.json());
    if (result.error) {
      showNotification({
        autoClose: 5000,
        title: "Error updating account",
        message: result.message,
        color: "red",
        icon: <Cross />,
      });
    } else {
      form.reset();
      showNotification({
        autoClose: 5000,
        title: "Account updated",
        message:
          "The accound of " +
          formEdit.values.username +
          " has been updated successfully. Reload to see changes.",
        color: "green",
        icon: <Check />,
      });
    }
  };

  return (
      <Page>
        <SimpleGrid
          cols={2}
          spacing="md"
          breakpoints={[{ maxWidth: "sm", cols: 1 }]}
        >
          <Skeleton
            height={PRIMARY_COL_HEIGHT}
            radius="md"
            animate={false}
            visible={false}
          >
            <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                Users
              </Text>
              <ScrollArea>
                <Table>
                  <thead>
                    <tr>
                      <th>UID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data
                      ? data?.map((user: any) => (
                          <tr key={user.uid}>
                            <td>{user.uid}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{getRoleFromPermission(user.permission)}</td>
                            <td>
                              <Group spacing="xs">
                                <Tooltip gutter={10} label="Delete" withArrow>
                                  <ActionIcon
                                    onClick={() => handleDeleteUser(user.uid)}
                                    variant="transparent"
                                    disabled={user.username === "root"}
                                  >
                                    <ThemeIcon color={"red"} variant="light">
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
          </Skeleton>
          <Grid gutter="md">
            <Grid.Col>
              <Skeleton
                height={SECONDARY_COL_HEIGHT * 1.5}
                radius="md"
                animate={false}
                visible={false}
              >
                <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
                  <Text
                    color="dimmed"
                    size="xs"
                    transform="uppercase"
                    weight={700}
                  >
                    User Control
                  </Text>
                  <Tabs
                    variant="pills"
                    tabPadding="md"
                    style={{ marginTop: theme.spacing.md }}
                  >
                    <Tabs.Tab
                      label="Add new User"
                      icon={<UserPlus size={14} />}
                    >
                      <form onSubmit={form.onSubmit(handleAddUser)}>
                        <TextInput
                          label="Username"
                          name="username"
                          placeholder="Username"
                          required
                          style={{ marginBottom: theme.spacing.md }}
                          {...form.getInputProps("username")}
                        />
                        <Group>
                          <TextInput
                            label="Email"
                            name="email"
                            placeholder="Email"
                            required
                            style={{
                              marginBottom: theme.spacing.md,
                              width: "100%",
                            }}
                            {...form.getInputProps("email")}
                          />
                        </Group>

                        <Divider my="sm" />
                        <Select
                          label="Role"
                          name="role"
                          placeholder="Select a role"
                          required
                          style={{ marginBottom: theme.spacing.md }}
                          data={[
                            { value: "0", label: "User" },
                            { value: "1", label: "Builder" },
                            { value: "2", label: "Moderator" },
                            { value: "4", label: "Admin" },
                          ]}
                          {...form.getInputProps("role")}
                        />
                        <Textarea
                          label="About"
                          name="about"
                          placeholder="Something about the user..."
                          style={{ marginBottom: theme.spacing.md }}
                          {...formEdit.getInputProps("about")}
                        />
                        <Group position="center" grow>
                          <TextInput
                            label="Discord"
                            name="discord"
                            placeholder="Discord"
                            style={{ marginBottom: theme.spacing.md }}
                            {...form.getInputProps("discord")}
                          />
                          <TextInput
                            label="Minecraft"
                            name="minecraft"
                            placeholder="Minecraft"
                            style={{ marginBottom: theme.spacing.md }}
                            {...formEdit.getInputProps("minecraft")}
                          />
                        </Group>

                        <Button
                          type="submit"
                          size="sm"
                          mt="xs"
                          mb="xs"
                          fullWidth
                        >
                          Add User
                        </Button>
                      </form>
                    </Tabs.Tab>
                    <Tabs.Tab
                      label="Edit exisiting User"
                      icon={<Pencil size={14} />}
                    >
                      <form onSubmit={formEdit.onSubmit(handleEditUser)}>
                        <Group position="center" grow>
                          <NumberInput
                            label="UID"
                            name="uid"
                            placeholder="UID"
                            required
                            hideControls
                            style={{ marginBottom: theme.spacing.md }}
                            {...formEdit.getInputProps("uid")}
                          />
                          <TextInput
                            label="Username"
                            name="username"
                            placeholder="Username"
                            style={{ marginBottom: theme.spacing.md }}
                            {...formEdit.getInputProps("username")}
                          />
                        </Group>
                        <Group position="center" grow>
                          <TextInput
                            label="Password"
                            name="password"
                            placeholder="Password"
                            style={{ marginBottom: theme.spacing.md }}
                            {...formEdit.getInputProps("password")}
                          />
                          <Select
                            label="Role"
                            name="role"
                            placeholder="Select a role"
                            style={{ marginBottom: theme.spacing.md }}
                            data={[
                              { value: "0", label: "User" },
                              { value: "1", label: "Builder" },
                              { value: "2", label: "Moderator" },
                              { value: "4", label: "Admin" },
                            ]}
                            {...formEdit.getInputProps("role")}
                          />
                        </Group>

                        <Divider my="sm" />
                        <Group position="center" grow>
                          <TextInput
                            label="Discord"
                            name="discord"
                            placeholder="Discord"
                            style={{ marginBottom: theme.spacing.md }}
                            {...form.getInputProps("discord")}
                          />
                          <TextInput
                            label="Minecraft"
                            name="minecraft"
                            placeholder="Minecraft"
                            style={{ marginBottom: theme.spacing.md }}
                            {...formEdit.getInputProps("minecraft")}
                          />
                        </Group>

                        <Textarea
                          label="About"
                          name="about"
                          placeholder="Something about the user..."
                          style={{ marginBottom: theme.spacing.md }}
                          {...formEdit.getInputProps("about")}
                        />

                        <Group position="center" grow>
                          <TextInput
                            label="Profile Picture"
                            name="picture"
                            placeholder="https://..."
                            style={{ marginBottom: theme.spacing.md }}
                            {...formEdit.getInputProps("picture")}
                          />
                          <TextInput
                            label="Background Image"
                            name="image"
                            placeholder="https://..."
                            style={{ marginBottom: theme.spacing.md }}
                            {...formEdit.getInputProps("image")}
                          />
                        </Group>
                        <Button
                          type="submit"
                          size="sm"
                          mt="xs"
                          mb="xs"
                          fullWidth
                        >
                          Update User
                        </Button>
                      </form>
                    </Tabs.Tab>
                  </Tabs>
                </Paper>
              </Skeleton>
            </Grid.Col>
            <Grid.Col span={6}>
              <Skeleton
                height={SECONDARY_COL_HEIGHT / 2}
                radius="md"
                animate={false}
                visible={false}
              >
                <Paper
                  withBorder
                  radius="md"
                  p="xs"
                  style={{ height: "100%" }}
                ></Paper>
              </Skeleton>
            </Grid.Col>
            <Grid.Col span={6}>
              <Skeleton
                height={SECONDARY_COL_HEIGHT / 2}
                radius="md"
                animate={false}
                visible={false}
              >
                <Paper
                  withBorder
                  radius="md"
                  p="xs"
                  style={{ height: "100%" }}
                ></Paper>
              </Skeleton>
            </Grid.Col>
          </Grid>
        </SimpleGrid>
      </Page>
  );
};

export default UsersPage;
