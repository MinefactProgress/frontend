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
import { Center, Grid, Paper, Text, useMantineTheme } from "@mantine/core";

import Page from "../../components/Page";
import { Pie } from "react-chartjs-2";
import useSWR from "swr";

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
  const { data } = useSWR("http://142.44.137.53:8080/api/network/ping");
  const { data: players } = useSWR(
    "http://142.44.137.53:8080/api/playerstats/get"
  );
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
          <Text size="lg">
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
                      theme.colors[
                        data?.java.online
                          ? data?.bedrock.online
                            ? "green"
                            : "orange"
                          : data?.bedrock.online
                          ? "orange"
                          : "red"
                      ][3],
                      theme.colors[data?.java.online
                        ? data?.bedrock.online
                          ? "green"
                          : "orange"
                        : data?.bedrock.online
                        ? "orange"
                        : "red"][5],
                      theme.colors[data?.java.online
                        ? data?.bedrock.online
                          ? "green"
                          : "orange"
                        : data?.bedrock.online
                        ? "orange"
                        : "red"][7],
                      theme.colors[data?.java.online
                        ? data?.bedrock.online
                          ? "green"
                          : "orange"
                        : data?.bedrock.online
                        ? "orange"
                        : "red"][9],
                    ],
                    borderColor: [
                      "rgba(75, 192, 192, 1)",
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 206, 86, 1)",
                      "rgba(196, 104, 203, 1)",
                      "rgba(255, 99, 132, 1)",
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
              This Weeks Player Count
            </Text>
          </Paper>
        </Grid.Col>
      </Grid>
    </Page>
  );
};
export default NetworkPage;
