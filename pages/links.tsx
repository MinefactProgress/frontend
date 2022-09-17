import {
  Button,
  Grid,
  Group,
  Paper,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";

import { Link } from "tabler-icons-react";
import Page from "../components/Page";
import { Permissions } from "../utils/hooks/usePermission";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import useSWR from "swr";
import useUser from "../utils/hooks/useUser";

const LinksPage = () => {
  const theme = useMantineTheme();
  const router = useRouter();
  const [user] = useUser();
  const { data } = useSWR("/api/admin/settings/get/links");
  const form = useForm({
    initialValues: {
      name: "",
      link: "",
      short: "",
    },
  });
  const handleSubmit = async (values: typeof form.values) => {
    const result = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/admin/settings/set",
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
          value: [
            { name: values.name, link: values.link, short: values.short },
            ...data.value,
          ],
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
              ></TextInput><TextInput
              label="Redirect"
              placeholder="Text behind https://progress.minefact.de/l/ to get redirected to this URL"
              {...form.getInputProps("short")}
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
      <Grid>
        {data?.value?.map((link: any, i: number) => (
          <Grid.Col sm={12} md={4} key={i}>
            <Paper
              withBorder
              radius="md"
              p="xs"
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                window.open(link.link, "_blank");
              }}
            >
              <Text>{link.name}</Text>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </Page>
  );
};
export default LinksPage;
