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
  Skeleton,
  Table,
  Tabs,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Tooltip,
  useMantineTheme,
  Badge,
} from "@mantine/core";
import {
  Calendar,
  Check,
  Cross,
  Pencil,
  Trash,
  UserPlus,
  X,
} from "tabler-icons-react";

import Page from "../../components/Page";
import { getRoleFromPermission } from "../../utils/hooks/usePermission";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useModals } from "@mantine/modals";
import useSWR, { mutate } from "swr";
import useUser from "../../utils/hooks/useUser";
import { useState } from "react";
import { Ranks, rankToColor } from "../../utils/userUtils";
import { DatePicker } from "@mantine/dates";

const UsersPage = () => {
  const PRIMARY_COL_HEIGHT = 840;
  const theme = useMantineTheme();
  const modals = useModals();
  const [user] = useUser();
  const [historyUser, setHistoryUser] = useState<string | null>(null);
  const [addHistoryRank, setAddHistoryRank] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      discord: "",
      rank: "",
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
      rank: "",
      role: "",
      password: "",
      about: "",
      picture: "",
      image: "",
    },

    validate: {},
  });
  const SECONDARY_COL_HEIGHT = PRIMARY_COL_HEIGHT / 2 - theme.spacing.md / 2;
  const { data } = useSWR("/api/users/get");
  const { data: registrations } = useSWR("/api/users/registrations/get");
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
          process.env.NEXT_PUBLIC_API_URL +
            "/api/users/delete?key=" +
            user.apikey,
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
              " has been deleted successfully.",
            color: "green",
            icon: <Check />,
          });
          mutate("/api/users/get");
        }
      },
    });
  };
  const handleAddUser = async (e: any) => {
    const result = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/users/create?key=" + user.apikey,
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
      mutate("/api/users/get");
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
      process.env.NEXT_PUBLIC_API_URL + "/api/users/update?key=" + user.apikey,
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
          " has been updated successfully.",
        color: "green",
        icon: <Check />,
      });
      mutate("/api/users/get");
    }
  };
  const handleSaveRankHistory = (index: number, type: string, value: any) => {
    const stats = data?.find(
      (user: any) => user.uid === parseInt(historyUser || "")
    ).stats;

    stats.rank_history[index][type] = value
      ? new Date(value).toISOString()
      : null;

    fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/users/update?key=" + user.apikey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: historyUser,
          values: {
            stats: JSON.stringify(stats),
          },
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          showNotification({
            title: "Error updating Rank History",
            message: res.message,
            color: "red",
            icon: <Cross />,
          });
        } else {
          showNotification({
            title: "Rank History updated",
            message: "Rank History updated successfully",
            color: "green",
            icon: <Check />,
          });
          mutate("/api/users/get");
        }
      });
  };
  const addRankHistory = () => {
    const stats = data?.find(
      (user: any) => user.uid === parseInt(historyUser || "")
    ).stats;

    stats.rank_history.push({
      rank: addHistoryRank,
      from: null,
      till: null,
    });

    fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/users/update?key=" + user.apikey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: historyUser,
          values: {
            stats: JSON.stringify(stats),
          },
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          showNotification({
            title: "Error updating Rank History",
            message: res.message,
            color: "red",
            icon: <Cross />,
          });
        } else {
          showNotification({
            title: "Rank added",
            message: `Rank ${addHistoryRank} added successfully`,
            color: "green",
            icon: <Check />,
          });
          setAddHistoryRank(null);
          mutate("/api/users/get");
        }
      });
  };
  const removeRankHistory = (index: number) => {
    const stats = data?.find(
      (user: any) => user.uid === parseInt(historyUser || "")
    ).stats;

    stats.rank_history.splice(index, 1);

    fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/users/update?key=" + user.apikey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: historyUser,
          values: {
            stats: JSON.stringify(stats),
          },
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          showNotification({
            title: "Error updating Rank History",
            message: res.message,
            color: "red",
            icon: <Cross />,
          });
        } else {
          showNotification({
            title: "Rank removed",
            message: "Rank removed successfully",
            color: "green",
            icon: <Check />,
          });
          mutate("/api/users/get");
        }
      });
  };

  return (
    <Page>
      <Grid>
        <Grid.Col sm={7}>
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
              <ScrollArea style={{ height: "86vh" }} type="hover">
                <Table>
                  <thead>
                    <tr>
                      <th>UID</th>
                      <th>Name</th>
                      <th>Discord</th>
                      <th>Minecraft Role</th>
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
                            <td>{user.discord}</td>
                            <td>{user.rank}</td>
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
        </Grid.Col>
        <Grid.Col sm={5}>
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
                    variant="outline"
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
                          {...form.getInputProps("about")}
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
                            label="Minecraft Rank"
                            name="minecraft"
                            placeholder="Minecraft Rank"
                            style={{ marginBottom: theme.spacing.md }}
                            {...form.getInputProps("rank")}
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
                            label="Minecraft Rank"
                            name="minecraft"
                            placeholder="Minecraft Rank"
                            style={{ marginBottom: theme.spacing.md }}
                            {...formEdit.getInputProps("rank")}
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
                    <Tabs.Tab
                      label="Edit Rank History"
                      icon={<Pencil size={14} />}
                    >
                      <Select
                        label="User"
                        placeholder="Select user"
                        value={historyUser}
                        onChange={setHistoryUser}
                        searchable
                        clearable
                        data={
                          data
                            ? data
                                ?.sort((a: any, b: any) => {
                                  return a.username
                                    .toLowerCase()
                                    .localeCompare(b.username);
                                })
                                .map((user: any) => ({
                                  value: `${user.uid}`,
                                  label: user.username,
                                }))
                            : []
                        }
                      />
                      <Divider
                        my="sm"
                        style={{
                          marginTop: theme.spacing.md,
                          marginBottom: theme.spacing.md,
                        }}
                      />
                      <ScrollArea style={{ height: "44vh" }}>
                        {data
                          ? data
                              ?.find(
                                (user: any) =>
                                  user.uid === parseInt(historyUser || "")
                              )
                              ?.stats.rank_history.map(
                                (rank: any, i: number) => (
                                  <Group
                                    key={i}
                                    style={{ marginBottom: theme.spacing.md }}
                                  >
                                    <Badge
                                      style={{
                                        backgroundColor: rankToColor(rank.rank),
                                        color: "#FFFFFF",
                                        opacity: 1,
                                        marginTop: theme.spacing.xl,
                                        width: "19%",
                                      }}
                                    >
                                      {rank.rank}
                                    </Badge>
                                    <DatePicker
                                      width={"20px"}
                                      maxDate={new Date()}
                                      label="From"
                                      placeholder="Select Date"
                                      icon={<Calendar size={16} />}
                                      defaultValue={
                                        rank.from ? new Date(rank.from) : null
                                      }
                                      onChange={(date: any) => {
                                        handleSaveRankHistory(i, "from", date);
                                      }}
                                      style={{ width: "32%" }}
                                    />
                                    <DatePicker
                                      maxDate={new Date()}
                                      label="Till"
                                      placeholder="Select Date"
                                      icon={<Calendar size={16} />}
                                      defaultValue={
                                        rank.till ? new Date(rank.till) : null
                                      }
                                      onChange={(date: any) => {
                                        handleSaveRankHistory(i, "till", date);
                                      }}
                                      style={{ width: "32%" }}
                                    />
                                    <Tooltip
                                      label="Delete Rank"
                                      withArrow
                                      position="bottom"
                                    >
                                      <ActionIcon
                                        size="sm"
                                        radius="xl"
                                        variant="outline"
                                        style={{
                                          marginTop: theme.spacing.xl,
                                          color: "red",
                                          borderColor: "red",
                                        }}
                                        onClick={() => removeRankHistory(i)}
                                      >
                                        <X size={16} />
                                      </ActionIcon>
                                    </Tooltip>
                                  </Group>
                                )
                              )
                          : null}
                        {historyUser ? (
                          <>
                            <Divider
                              my="sm"
                              style={{
                                marginTop: theme.spacing.md,
                                marginBottom: theme.spacing.md,
                              }}
                            />
                            <Group grow>
                              <Select
                                label="Add Rank"
                                placeholder="Select Rank"
                                value={addHistoryRank}
                                onChange={setAddHistoryRank}
                                searchable
                                clearable
                                data={Ranks}
                                style={{}}
                              />
                              <Button
                                color="green"
                                style={{ marginTop: theme.spacing.xl }}
                                onClick={() => addRankHistory()}
                              >
                                Add
                              </Button>
                            </Group>
                          </>
                        ) : null}
                      </ScrollArea>
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
        </Grid.Col>
      </Grid>
    </Page>
  );
};

export default UsersPage;
