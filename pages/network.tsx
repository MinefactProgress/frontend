import {
  ActionIcon,
  Badge,
  Center,
  Chip,
  Code,
  Grid,
  Group,
  Paper,
  ScrollArea,
  Table,
  Text,
  TextInput,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { IconCheck, IconHierarchy, IconReload, IconX } from "@tabler/icons";
import { Line, Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

import { Page } from "../components/Page";
import { StatsGroup } from "../components/Stats";
import { timeDiff } from "../util/time";
import { useInterval } from "@mantine/hooks";
import { useRouter } from "next/router";

const humanizeDuration = require("humanize-duration");

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

const Network = () => {
  const router = useRouter();
  const [dateNow, setDateNow] = useState(new Date());
  const dateInverval = useInterval(() => setDateNow(new Date()), 1000);
  const { data } = useSWR("/v1/network/status");
  const { data: proxies } = useSWR("/v1/network/status/proxies", {
    refreshInterval: 60000,
  });

  useEffect(() => {
    dateInverval.start();
    return dateInverval.stop;
  });

  const theme = useMantineTheme();
  return (
    <Page name="Network" icon={<IconHierarchy />}>
      <Paper
        withBorder
        radius="md"
        p="xs"
        style={{
          marginBottom: theme.spacing.md,
          backgroundColor: proxies?.java.online
            ? proxies?.bedrock.online
              ? theme.colors.green[9]
              : theme.colors.orange[7]
            : proxies?.bedrock.online
            ? theme.colors.orange[7]
            : theme.colors.red[9],
          color: theme.colors.gray[0],
        }}
      >
        <Center>
          <Text
            size="lg"
            style={{
              marginBottom: theme.spacing.md / 2,
              marginTop: theme.spacing.md / 2,
            }}
          >
            {proxies?.java.online
              ? proxies?.bedrock.online
                ? "The Network is Online"
                : "Only the Java Network is Online"
              : proxies?.bedrock.online
              ? "Only the Bedrock Network is Online"
              : "The Network is Offline"}
          </Text>
        </Center>
      </Paper>
      <Grid>
        <Grid.Col sm={4}>
          <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
            <Text style={{ fontWeight: 700 }}>Proxy Status</Text>

            <Group spacing="xs">
              <ThemeIcon
                variant="light"
                color={proxies?.java.online ? "green" : "red"}
              >
                {proxies?.java.online ? <IconCheck /> : <IconX />}
              </ThemeIcon>
              <p>Java Proxy:</p>
              <Code>{proxies?.java.ip.default}</Code>
            </Group>
            <Group spacing="xs">
              <ThemeIcon
                variant="light"
                color={proxies?.java.online ? "green" : "red"}
              >
                {proxies?.java.online ? <IconCheck /> : <IconX />}
              </ThemeIcon>
              <p>Java Fallback Proxy:</p>
              <Code>{proxies?.java.ip.fallback}</Code>
            </Group>
            <Group spacing="xs">
              <ThemeIcon
                variant="light"
                color={proxies?.bedrock.online ? "green" : "red"}
              >
                {proxies?.bedrock.online ? <IconCheck /> : <IconX />}
              </ThemeIcon>
              <p>Bedrock Proxy:</p>
              <Code>{proxies?.bedrock.ip}</Code>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col sm={4}>
          <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
            <Text style={{ fontWeight: 700 }}>Proxy Versions</Text>

            <Group spacing="xs">
              <p>Java Proxy:</p>
              <Code>{proxies?.java.version.support}</Code>
            </Group>
            <Group spacing="xs">
              <p>Java Fallback Proxy:</p>
              <Code>{proxies?.java.version.support}</Code>
            </Group>
            <Group spacing="xs">
              <p>Bedrock Proxy:</p>
              <Code>{proxies?.bedrock.version.name}</Code>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col sm={4}>
          <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
            <Text style={{ fontWeight: 700 }}>Last Update</Text>

            <Group spacing="xs">
              <ActionIcon
                variant="light"
                onClick={() => mutate("/v1/network/status/proxies")}
                color="primary"
              >
                <IconReload />
              </ActionIcon>
              <p>Proxy Status:</p>
              <Code>
                {humanizeDuration(
                  timeDiff(new Date(proxies?.java.last_updated), dateNow),
                  { largest: 2, round: true, maxDecimalPoints: 2 }
                )}
              </Code>
            </Group>
            <Group spacing="xs">
              <ActionIcon
                variant="light"
                onClick={() => mutate("/v1/network/status/proxies")}
                color="primary"
              >
                <IconReload />
              </ActionIcon>
              <p>Build Teams Status:</p>
              <Code>
                {humanizeDuration(
                  timeDiff(new Date(proxies?.java.last_updated), dateNow),
                  { largest: 2, round: true, maxDecimalPoints: 2 }
                )}
              </Code>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={12}>
          <StatsGroup
            data={[
              {
                title: "Players",
                stats: proxies?.java.players.groups.hub,
                description: "in the Hub.",
              },
              {
                title: "Players",
                stats: proxies?.java.players.groups.plot,
                description: "in the Plot Server.",
              },
              {
                title: "Players",
                stats: proxies?.java.players.groups.buildteams,
                description: "in Build Teams.",
              },
              {
                title: "Players",
                stats: proxies?.java.players.groups.other,
                description: "in Other Servers.",
              },
            ]}
          />
        </Grid.Col>
      </Grid>
    </Page>
  );
};
export default Network;
