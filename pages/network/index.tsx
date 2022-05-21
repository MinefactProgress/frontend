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
  Button,
  Center,
  Grid,
  Group,
  Paper,
  Select,
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
  const { data } = useSWR("http://142.44.137.53:8080/api/network/ping");
  const { data: playersRw } = useSWR(
    "http://142.44.137.53:8080/api/playerstats/get"
  );
  const { data: servers } = useSWR(
    "http://142.44.137.53:8080/api/admin/settings/get/ips"
  );
  var players: any = {
    labels: [],
    datasets: { total: [], lobby: [], buildteams: [], building: [], other: [] },
  };

  playersRw?.slice(-7).forEach((element: any) => {
    players.labels.push(new Date(element.date).toLocaleDateString());
    players.datasets.total.push(element.peaks.total);
    players.datasets.lobby.push(element.peaks.lobby);
    players.datasets.buildteams.push(element.peaks.buildteams);
    players.datasets.building.push(element.peaks.building);
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
        <Grid.Col span={5}>
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
              data={{
                labels: ["Lobby", "Building", "Build Teams", "Other"],
                datasets: [
                  {
                    label: "Players",
                    data: [
                      data?.java.players.groups.lobby,
                      data?.java.players.groups.building,
                      data?.java.players.groups.buildteams,
                      data?.java.players.groups.other,
                    ],
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
        <Grid.Col span={7}>
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
              height={"210px"}
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
                    label: players ? "Lobby" : "",
                    data: players.datasets.lobby,
                    borderColor: theme.colors.indigo[7] + "66",
                    tension: 0.1,
                    fill: true,
                    backgroundColor: theme.colors.indigo[7] + "10",
                    borderWidth: 2,
                  },
                  {
                    label: players ? "Building" : "",
                    data: players.datasets.building,
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
      <Paper
        withBorder
        radius="md"
        p="xs"
        style={{ marginBottom: theme.spacing.md }}
      >
        <Text
          color="dimmed"
          size="xs"
          transform="uppercase"
          weight={700}
          style={{ marginBottom: theme.spacing.md }}
        >
          Ping a Network Server
        </Text>
        <Group grow>
          <Select
            placeholder="Select a Server to ping"
            searchable
            nothingFound="No Server found"
            data={Object.keys(servers?.value || {})}
            selectedServer={selectedServer}
            // @ts-ignore
            onChange={setSelectedServer}
          />
          <Button
            onClick={(e: any) => {
              router.push("/network/" + selectedServer);
            }}
          >
            Ping!
          </Button>
        </Group>
      </Paper>
    </Page>
  );
};
export default NetworkPage;
