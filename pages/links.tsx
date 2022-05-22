import {
  Button,
  Group,
  Paper,
  SimpleGrid,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";

import { Link } from "tabler-icons-react";
import Page from "../components/Page";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import useSWR from "swr";
import useUser from "../utils/hooks/useUser";
import { Permissions } from "../utils/hooks/usePermission";

const LinksPage = () => {
  const theme = useMantineTheme();
  const router = useRouter();
  const [user] = useUser();
  const { data } = useSWR(
    "http://142.44.137.53:8080/api/admin/settings/get/links"
  );
  const form = useForm({
    initialValues: {
      name: "",
      link: "",
    },
  });
  const handleSubmit = async (values: typeof form.values) => {
    const result = await fetch(
      "http://142.44.137.53:8080/api/admin/settings/set",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          key: user.apikey,
          name: "links",
          permission: 1,
          value: [{ name: values.name, link: values.link }, ...data.value],
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          showNotification({
            title: "Error Adding Link",
            message: res.message,
            color: "red",
            icon: <Link />,
          });
        } else {
          form.reset();
          showNotification({
            title: "Link Added",
            message: "Link has been added successfully",
            color: "green",
            icon: <Link />,
          });
        }
      });
  };
  return (
    <Page>
      <Paper
        withBorder
        radius="md"
        p="xs"
        style={{
          marginBottom: theme.spacing.md,
        }}
      >
        <Title>Useful Link List</Title>
      </Paper>
      {(user.permission || 0) >= Permissions.Moderator ? (
        <Paper
          withBorder
          radius="md"
          p="xs"
          style={{
            marginBottom: theme.spacing.md,
          }}
        >
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Group grow>
              <TextInput
                label="Name"
                placeholder="Website Name"
                {...form.getInputProps("name")}
              ></TextInput>
              <TextInput
                label="Link"
                placeholder="Website Link"
                {...form.getInputProps("link")}
              ></TextInput>
            </Group>
            <Button
              type="submit"
              fullWidth
              style={{
                marginTop: theme.spacing.md,
              }}
            >
              Add Link
            </Button>
          </form>
        </Paper>
      ) : null}
      <SimpleGrid cols={4}>
        {data?.value?.map((link: any, i: number) => (
          <Paper
            key={i}
            withBorder
            radius="md"
            p="xs"
            style={{
              marginBottom: theme.spacing.md,
              cursor: "pointer",
            }}
            onClick={() => {
              window.open(link.link, '_blank');
            }}
          >
            <Text>{link.name}</Text>
          </Paper>
        ))}
      </SimpleGrid>
    </Page>
  );
};
export default LinksPage;
