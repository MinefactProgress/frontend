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
import { doesNotMatch } from "assert";
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
  const { data } = useSWR("/api/network/ping/" + router.query.server);
  const { data:network } = useSWR("/api/network/ping");
  const { data: servers } = useSWR(
    "/api/admin/settings/get/ips"
  );
  const { data: playersRw } = useSWR(
    "/api/playerstats/get"
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
  console.log(data);
  return (
    <Page>
        <Paper
        withBorder
        radius="md"
        p="xs"
        style={{
          marginBottom: theme.spacing.md,
          backgroundColor: network?.java.online
            ? network?.bedrock.online
              ? theme.colors.green[9]+"aa"
              : theme.colors.orange[7]+"aa"
            : network?.bedrock.online
            ? theme.colors.orange[7]+"aa"
            : theme.colors.red[9]+"aa",
          color: theme.colors.gray[0]+"aa",
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
            {network?.java.online
              ? network?.bedrock.online
                ? "The Network is Online"
                : "Only the Java Network is Online"
              : network?.bedrock.online
              ? "Only the Bedrock Network is Online"
              : "The Network is Offline"}
          </Text>
        </Center>
      </Paper>
      <Paper
        withBorder
        radius="md"
        p="xs"
        style={{
          marginBottom: theme.spacing.md,
          backgroundColor: data?.online
            ? theme.colors.green[9]
            : theme.colors.red[7],
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
            {data?.online?
                router.query.server+" is Online"
                : router.query.server+" is Offline"
              }
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
              Server Player Count
            </Text>
            {servers.online?<Pie
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
                labels: ["On "+router.query.server,"On other Server"],
                datasets: [
                  {
                    label: "Players",
                    data: [
                        data?.players?.online,
                        network?.java.players.total-data?.players?.online,
                      
                    ],
                    backgroundColor: [
                        theme.colors.grape[7] + "0f",
                        "#00000000",
                    ],
                    borderColor: [
                        theme.colors.grape[7],
                        "#00000000",
                    ],
                    borderWidth: 2,
                  },
                ],
              }}
            />:<Center style={{height:"610px",width:"100%"}}>
                No Data</Center>}
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
              This Weeks Network Player Counts
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
    </Page>
  );
};
export default NetworkPage;
