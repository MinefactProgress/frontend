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
import {
  Badge,
  Center,
  Grid,
  Paper,
  ScrollArea,
  Table,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { Line, Pie } from "react-chartjs-2";

import Page from "../../components/Page";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useState } from "react";

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

const NetworkPage = () => {
  const router = useRouter();
  const [selectedServer, setSelectedServer] = useState("");
  const { data } = useSWR("/api/network/ping", {
    refreshInterval: 60000,
  });
  const { data: playersRw } = useSWR("/api/playerstats/get");
  const { data: servers } = useSWR("/api/admin/settings/get/ips");

  const categories = Object.keys(data?.java.players.groups || []).map(
    (key: any) => key.charAt(0).toUpperCase() + key.substring(1)
  );
  var players: any = {
    labels: [],
    datasets: { total: [], hub: [], buildteams: [], plot: [], other: [] },
  };

  playersRw?.slice(-7).forEach((element: any) => {
    players.labels.push(new Date(element.date).toLocaleDateString());
    players.datasets.total.push(element.peaks.total);
    players.datasets.hub.push(element.peaks.hub);
    players.datasets.buildteams.push(element.peaks.buildteams);
    players.datasets.plot.push(element.peaks.plot);
    players.datasets.other.push(element.peaks.other);
  });

  const theme = useMantineTheme();
  return (
    <Page>
      <Paper
        withBorder
        radius="md"
        p="xs"
        style={{
          marginBottom: theme.spacing.md,
          backgroundColor: data?.java.online
            ? data?.bedrock.online
              ? theme.colors.green[9]
              : theme.colors.orange[7]
            : data?.bedrock.online
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
            {data?.java.online
              ? data?.bedrock.online
                ? "The Network is Online"
                : "Only the Java Network is Online"
              : data?.bedrock.online
              ? "Only the Bedrock Network is Online"
              : "The Network is Offline"}
          </Text>
        </Center>
      </Paper>
      <Grid>
        <Grid.Col sm={3}>
          <Paper
            withBorder
            radius="md"
            p="xs"
            style={{
              marginBottom: theme.spacing.md,
            }}
          >
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Current Player Count
            </Text>
            <Pie
              options={{
                responsive: true,
                scales: {
                  x: {
                    grid: {
                      display: false,
                      color: "#9848d533",
                      drawBorder: false,
                      z: 1,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    grid: {
                      display: false,
                      drawBorder: false,
                      color: "#ffffff00",
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },

                plugins: {
                  legend: {
                    display: false,
                  },
                  title: {
                    display: false,
                  },
                  tooltip: {
                    enabled: true,
                  },
                },
              }}
              height={"94%"}
              data={{
                labels: categories,
                datasets: [
                  {
                    label: "Players",
                    data: Object.values(data?.java.players.groups || []),
                    backgroundColor: [
                      theme.colors.indigo[7] + "0f",
                      theme.colors.grape[7] + "0f",
                      theme.colors.pink[7] + "0f",
                      theme.colors.cyan[7] + "0f",
                    ],
                    borderColor: [
                      theme.colors.indigo[7],
                      theme.colors.grape[7],
                      theme.colors.pink[7],
                      theme.colors.cyan[7],
                    ],
                    borderWidth: 2,
                  },
                ],
              }}
            />
          </Paper>
        </Grid.Col>
        <Grid.Col sm={9}>
          <Paper
            withBorder
            radius="md"
            p="xs"
            style={{
              marginBottom: theme.spacing.md,
            }}
          >
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              This Weeks Peak Player Counts
            </Text>
            <Line
              options={{
                responsive: true,
                scales: {
                  x: {
                    grid: {
                      display: true,
                      color: "#ffffff11",
                      drawBorder: false,
                      z: 1,
                    },
                  },
                  y: {
                    grid: {
                      drawBorder: false,
                      color: "#ffffff00",
                    },
                    min: 0,
                    max: Math.max(...players.datasets.total) * 1.5,
                  },
                },

                plugins: {
                  legend: {
                    display: false,
                  },
                  title: {
                    display: false,
                  },
                  tooltip: {
                    enabled: true,

                    mode: "index",
                  },
                },
              }}
              height={"94%"}
              data={{
                labels: players.labels,
                datasets: [
                  {
                    label: players ? "Total" : "",
                    data: players.datasets.total,
                    borderColor: theme.colors.lime[7],
                    tension: 0.1,
                    fill: true,
                    backgroundColor: theme.colors.lime[7] + "10",
                    borderWidth: 2,
                  },
                  {
                    label: players ? "Hub" : "",
                    data: players.datasets.hub,
                    borderColor: theme.colors.indigo[7] + "66",
                    tension: 0.1,
                    fill: true,
                    backgroundColor: theme.colors.indigo[7] + "10",
                    borderWidth: 2,
                  },
                  {
                    label: players ? "Plot" : "",
                    data: players.datasets.plot,
                    borderColor: theme.colors.grape[7] + "66",
                    tension: 0.1,
                    fill: true,
                    backgroundColor: theme.colors.grape[7] + "10",
                    borderWidth: 2,
                  },
                  {
                    label: players ? "Build Teams" : "",
                    data: players.datasets.buildteams,
                    borderColor: theme.colors.pink[7] + "66",
                    tension: 0.1,
                    fill: true,
                    backgroundColor: theme.colors.pink[7] + "10",
                    borderWidth: 2,
                  },
                  {
                    label: players ? "Other" : "",
                    data: players.datasets.other,
                    borderColor: theme.colors.cyan[7] + "66",
                    tension: 0.1,
                    fill: true,
                    backgroundColor: theme.colors.cyan[7] + "10",
                    borderWidth: 2,
                  },
                ],
              }}
            />
          </Paper>
        </Grid.Col>
      </Grid>
      <Paper withBorder radius="md" p="xs">
        <Text
          color="dimmed"
          size="xs"
          transform="uppercase"
          weight={700}
          style={{ marginBottom: theme.spacing.md }}
        >
          Server Status
        </Text>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>Server</th>
              <th>Status</th>
              <th>Version</th>
              <th>Players</th>
            </tr>
          </thead>
          <tbody>
            {data
              ? Object.entries(data?.spigot || [])
                  .sort((a: any, b: any) => b[1].online - a[1].online)
                  .map((server: any) =>
                    server[1].online ? (
                      <tr key={server[0]}>
                        <td>{server[0]}</td>
                        <td>
                          <Badge color="green">Online</Badge>
                        </td>
                        <td>{server[1].version.name.replace("Paper ", "")}</td>
                        <td>{`${server[1].players.online} / ${server[1].players.max}`}</td>
                      </tr>
                    ) : (
                      <tr key={server[0]}>
                        <td>{server[0]}</td>
                        <td>
                          <Badge color="red">Offline</Badge>
                        </td>
                        <td>---</td>
                        <td>---</td>
                      </tr>
                    )
                  )
              : null}
          </tbody>
        </Table>
      </Paper>
    </Page>
  );
};
export default NetworkPage;
