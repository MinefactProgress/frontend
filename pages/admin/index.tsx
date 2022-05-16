import {
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
import { Cpu, FileDatabase } from "tabler-icons-react";
import {
  Grid,
  Group,
  Modal,
  Paper,
  SimpleGrid,
  Skeleton,
  Text,
  useMantineTheme,
} from "@mantine/core";

import { Line } from "react-chartjs-2";
import { NextPage } from "next";
import Page from "../../components/Page";
import PermissionWrapper from "../../utils/hooks/usePermission";
import { StatsRing } from "../../components/StatsRing";
import StatsText from "../../components/StatsText";
import useSWR from "swr";
import { useState } from "react";
import useUser from "../../utils/hooks/useUser";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminPage: NextPage = () => {
  const [user] = useUser();
  const { data, error } = useSWR("http://localhost:8080/api/admin/status", {
    refreshInterval: 60000,
    shouldRetryOnError: true,
  });
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const PRIMARY_COL_HEIGHT = 220;
  const SECONDARY_COL_HEIGHT = PRIMARY_COL_HEIGHT / 2 - theme.spacing.md / 2;
  console.log(data);
  return (
    <PermissionWrapper permission={4}>
      <Page>
        {" "}
        <SimpleGrid
          cols={2}
          spacing="md"
          breakpoints={[{ maxWidth: "sm", cols: 1 }]}
        >
          <Skeleton height={PRIMARY_COL_HEIGHT} radius="md" animate={false} />
          <Grid gutter="md">
            <Grid.Col>
              <Skeleton
                height={SECONDARY_COL_HEIGHT}
                radius="md"
                animate={false}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <StatsRing
                label="CPU Usage"
                stats={data?.cpu}
                progress={parseInt(data?.cpu.split("%")[0])}
                icon={<Cpu />}
                color={
                  parseInt(data?.cpu.split("%")[0]) >= 70 ? "red" : "green"
                }
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
                Ram Usage Chart
              </Text>
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
            </Paper>
          </Skeleton>
          <Skeleton
            height={PRIMARY_COL_HEIGHT * 2}
            radius="md"
            animate={true}
            visible={!data}
          >
            <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                CPU Usage Chart
              </Text>
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
            </Paper>
          </Skeleton>
        </SimpleGrid>
        <SimpleGrid cols={5} spacing="md" sx={{ marginTop: theme.spacing.md }}>
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
          <Skeleton
            height={PRIMARY_COL_HEIGHT / 2}
            radius="md"
            animate={true}
            visible={!data}
          >
            <StatsText title="operatin system" style={{ height: "100%" }}>
              {data?.platform} ({data?.arch})
            </StatsText>
          </Skeleton>
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
          <Skeleton
            height={PRIMARY_COL_HEIGHT / 2}
            radius="md"
            animate={true}
            visible={!data}
          >
            <StatsText
              title="database version"
              style={{ height: "100%" }}
              onClick={() => setOpened(true)}
            >
              v{data?.database.version}
            </StatsText>
            <Modal
              opened={opened}
              onClose={() => setOpened(false)}
              title="Database"
              size="lg"
              overflow="inside"
            >
              {data?.database.status.map((e: any, i: number) => (
                <Text key={i}>
                  {e}
                  <br />
                </Text>
              ))}
            </Modal>

            <Group position="center"></Group>
          </Skeleton>
        </SimpleGrid>
      </Page>
    </PermissionWrapper>
  );
};

export default AdminPage;
