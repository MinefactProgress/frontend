import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  LogarithmicScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Cpu, FileDatabase } from "tabler-icons-react";
import {
  Grid,
  Group,
  Modal,
  Paper,
  SimpleGrid,
  Skeleton,
  Tabs,
  Text,
  useMantineTheme,
} from "@mantine/core";

import { Chart, Line } from "react-chartjs-2";
import { NextPage } from "next";
import Page from "../../components/Page";
import { StatsRing } from "../../components/StatsRing";
import StatsText from "../../components/StatsText";
import package_version from "../../package.json";
import useSWR from "swr";
import { useState } from "react";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LogarithmicScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminPage: NextPage = () => {
  const { data, error } = useSWR("/api/admin/status", {
    refreshInterval: 60000,
    shouldRetryOnError: true,
  });
  const response_times = data?.stats.response_times
    .map((e: any) => {
      return {
        route: e.route,
        requests: e.times.length,
        min: Math.min.apply(Math, e.times),
        max: Math.max.apply(Math, e.times),
        avg: e.times.reduce((a: number, b: number) => a + b) / e.times.length,
      };
    })
    .sort((a: any, b: any) => (a.route > b.route ? 1 : -1));
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const PRIMARY_COL_HEIGHT = 220;
  const SECONDARY_COL_HEIGHT = PRIMARY_COL_HEIGHT / 2 - theme.spacing.md / 2;
  return (
    <Page>
      <SimpleGrid
        cols={2}
        spacing="md"
        breakpoints={[{ maxWidth: "sm", cols: 1 }]}
      >
        <StatsText title="Backend Statistics">
          <SimpleGrid cols={2}>
            <Text color="dimmed">
              Total Requests
              <br />
              {data?.stats.total_requests}
            </Text>
            <Text color="dimmed">
              Successful Requests
              <br />
              {data?.stats.successful_requests}
            </Text>
            <Text color="dimmed">
              Invalid Requests
              <br />
              {data?.stats.total_requests - data?.stats.successful_requests}
            </Text>
            <Text color="dimmed">
              Errors occurred
              <br />
              {data?.stats.error_requests}
            </Text>
          </SimpleGrid>
        </StatsText>
        <Grid gutter="md">
          <Grid.Col span={6}>
            <StatsText title="Frontend Version" style={{ height: "100%" }}>
              {package_version.version}
            </StatsText>
          </Grid.Col>
          <Grid.Col span={6}>
            <StatsText title="Backend Version" style={{ height: "100%" }}>
              {data?.backend_version}
            </StatsText>
          </Grid.Col>
          <Grid.Col span={6}>
            <StatsRing
              label="CPU Usage"
              stats={data?.cpu}
              progress={parseInt(data?.cpu.split("%")[0])}
              icon={<Cpu />}
              color={parseInt(data?.cpu.split("%")[0]) >= 70 ? "red" : "green"}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <StatsRing
              label="RAM Usage"
              stats={data?.ram.usage}
              icon={<FileDatabase />}
              progress={
                parseInt(data?.ram.max.split("M")[0]) /
                parseInt(data?.ram.usage.split("M")[0]) /
                100
              }
              color={
                parseInt(data?.ram.max.split("M")[0]) /
                  parseInt(data?.ram.usage.split("M")[0]) /
                  100 >=
                70
                  ? "red"
                  : "green"
              }
            />
          </Grid.Col>
        </Grid>
      </SimpleGrid>
      <SimpleGrid
        cols={2}
        spacing="md"
        breakpoints={[{ maxWidth: "sm", cols: 1 }]}
        sx={{ marginTop: theme.spacing.md }}
      >
        <Skeleton
          height={PRIMARY_COL_HEIGHT * 2}
          radius="md"
          animate={true}
          visible={!data}
        >
          <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Performance
            </Text>
            <Chart
              type="bar"
              options={{
                responsive: true,
                scales: {
                  x: {
                    stacked: true,
                    grid: {
                      display: true,
                      color: "#499bee33",
                      drawBorder: false,
                      z: 1,
                    },
                    ticks: {
                      minRotation: 45,
                    },
                  },
                  y: {
                    stacked: true,
                    grid: {
                      drawBorder: false,
                      color: "#499bee0a",
                    },
                    type: "logarithmic",
                  },
                },
                plugins: {
                  legend: {
                    display: true,
                  },
                  title: {
                    display: false,
                  },
                  tooltip: {
                    displayColors: false,
                    titleColor: "#0066ff",
                    callbacks: {
                      label: function (context) {
                        return [
                          `Number of Requests: ${
                            response_times[context.dataIndex].requests
                          }`,
                          `Min Response Time: ${
                            response_times[context.dataIndex].min
                          } ms`,
                          `Max Response Time: ${
                            response_times[context.dataIndex].max
                          } ms`,
                          `Avg Response Time: ${
                            response_times[context.dataIndex].avg
                          } ms`,
                        ];
                      },
                    },
                  },
                },
              }}
              data={{
                labels: response_times?.map((e: any) => e.route) || [],
                datasets: [
                  {
                    label: "Min Response Time",
                    data: response_times?.map((e: any) => e.min),
                    backgroundColor: `rgba(0,130,11,${
                      theme.colorScheme === "dark" ? "0.2" : "0.4"
                    })`,
                  },
                  {
                    label: "Max Response Time",
                    data: response_times?.map((e: any) => e.max - e.min),
                    backgroundColor: `rgba(255,10,13,${
                      theme.colorScheme === "dark" ? "0.2" : "0.4"
                    })`,
                  },
                  {
                    type: "line",
                    label: "Avg Response Time",
                    data: response_times?.map((e: any) => e.avg),
                    backgroundColor: `rgba(252,186,3,${
                      theme.colorScheme === "dark" ? "0.6" : "1"
                    })`,
                    borderColor: `rgba(252,186,3,${
                      theme.colorScheme === "dark" ? "0.6" : "1"
                    })`,
                  },
                ],
              }}
            />
          </Paper>
        </Skeleton>
        <Skeleton
          height={PRIMARY_COL_HEIGHT * 2}
          radius="md"
          animate={true}
          visible={!data}
        >
          <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
            <Tabs variant="outline" defaultValue="cpu">
              <Tabs.List>
                <Tabs.Tab value="cpu" icon={<Cpu size={14} />}>
                  CPU Usage
                </Tabs.Tab>
                <Tabs.Tab value="ram" icon={<FileDatabase size={14} />}>
                  Ram Usage
                </Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="cpu">
                <Line
                  options={{
                    responsive: true,
                    scales: {
                      x: {
                        grid: {
                          display: true,
                          color: "#9848d533",
                          drawBorder: false,
                          z: 1,
                        },
                      },
                      y: {
                        grid: {
                          drawBorder: false,
                          color: "#9848d50a",
                        },
                        min: 0,
                        max: 100,
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
                    labels: data?.history.cpu.map((e: any, i: any) =>
                      data?.history.cpu.length - i - 1 == 0
                        ? "Now"
                        : data?.history.cpu.length - i - 1 + " min ago"
                    ),
                    datasets: [
                      {
                        label: "Cpu",
                        data: data?.history.cpu.map((e: any) =>
                          e.replace("%", "")
                        ),
                        borderColor: "#9848d5",
                        tension: 0.3,
                        fill: true,
                        backgroundColor: "#9848d510",
                        borderWidth: 2,
                      },
                    ],
                  }}
                />
              </Tabs.Panel>
              <Tabs.Panel value="ram">
                <Line
                  options={{
                    responsive: true,
                    scales: {
                      x: {
                        grid: {
                          display: true,
                          color: "#499bee33",
                          drawBorder: false,
                          z: 1,
                        },
                      },
                      y: {
                        grid: {
                          drawBorder: false,
                          color: "#499bee0a",
                        },
                        min: 0,
                        max: 100,
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
                    labels: data?.history.ram.map((e: any, i: any) =>
                      data?.history.ram.length - i - 1 == 0
                        ? "Now"
                        : data?.history.ram.length - i - 1 + " min ago"
                    ),
                    datasets: [
                      {
                        label: "Ram",
                        data: data?.history.ram.map(
                          (e: any) =>
                            100 /
                            (data?.ram.max.split("MB")[0] / e.split("MB")[0])
                        ),
                        borderColor: "#499bee",
                        tension: 0.3,
                        fill: true,
                        backgroundColor: "#499bee10",
                        borderWidth: 2,
                      },
                    ],
                  }}
                />
              </Tabs.Panel>
            </Tabs>
          </Paper>
        </Skeleton>
      </SimpleGrid>
      <Grid sx={{ marginTop: theme.spacing.md }} columns={25}>
        <Grid.Col sm={5}>
          <Skeleton
            height={PRIMARY_COL_HEIGHT / 2}
            radius="md"
            animate={true}
            visible={!data}
          >
            <StatsText title="status" style={{ height: "100%" }}>
              {data?.status}
            </StatsText>
          </Skeleton>
        </Grid.Col>
        <Grid.Col sm={5}>
          <Skeleton
            height={PRIMARY_COL_HEIGHT / 2}
            radius="md"
            animate={true}
            visible={!data}
          >
            <StatsText title="uptime" style={{ height: "100%" }}>
              {data?.uptime.formatted}
            </StatsText>
          </Skeleton>
        </Grid.Col>
        <Grid.Col sm={5}>
          <Skeleton
            height={PRIMARY_COL_HEIGHT / 2}
            radius="md"
            animate={true}
            visible={!data}
          >
            <StatsText title="operating system" style={{ height: "100%" }}>
              {data?.platform} ({data?.arch})
            </StatsText>
          </Skeleton>
        </Grid.Col>
        <Grid.Col sm={5}>
          <Skeleton
            height={PRIMARY_COL_HEIGHT / 2}
            radius="md"
            animate={true}
            visible={!data}
          >
            <StatsText title="Node version" style={{ height: "100%" }}>
              {data?.version}
            </StatsText>
          </Skeleton>
        </Grid.Col>
        <Grid.Col sm={5}>
          <Skeleton
            height={PRIMARY_COL_HEIGHT / 2}
            radius="md"
            animate={true}
            visible={!data}
          >
            <StatsText
              title="database"
              style={{ height: "100%" }}
              onClick={() => setOpened(true)}
            >
              {data?.database.status[0]}
            </StatsText>
            <Modal
              opened={opened}
              onClose={() => setOpened(false)}
              title="Database"
              size="lg"
              overflow="inside"
            >
              <Text>Version: v{data?.database.version}</Text>
            </Modal>

            <Group position="center"></Group>
          </Skeleton>
        </Grid.Col>
      </Grid>
    </Page>
  );
};

export default AdminPage;
