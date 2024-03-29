import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
} from "chart.js";
import {
  Button,
  Grid,
  Group,
  Paper,
  Skeleton,
  Text,
  Title,
} from "@mantine/core";

import { BarChart } from "../components/charts/BarChart";
import { FastNavigation } from "../components/FastNavigation";
import { IconHome } from "@tabler/icons";
import { LineChart } from "../components/charts/LineChart";
import Motd from "../components/Motd";
import type { NextPage } from "next";
import { Page } from "../components/Page";
import { StatsGroup } from "../components/Stats";
import useSWR from "swr";
import useUser from "../hooks/useUser";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  ChartTooltip,
  Legend,
  Filler,
  ArcElement,
  BarElement
);

const Home: NextPage = ({}: any) => {
  const { data } = useSWR("/v1/progress");
  const [user] = useUser();

  return (
    <Page name="Home" icon={<IconHome />}>
      <Grid>
        <Grid.Col xs={12}>
          <Group position="center">
            <Motd />
          </Group>
        </Grid.Col>
        <Grid.Col sm={7}>
          <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
            <Title>Welcome back{user ? " " + user?.username : null}!</Title>
            <Text>
              We are tracking the Progress made on the BTE New York City
              building Project.
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col sm={5}>
          <FastNavigation />
        </Grid.Col>
        <Grid.Col xs={12}>
          <StatsGroup
            data={[
              {
                title: "Projects",
                stats: data?.projects?.[0].projects,
                description:
                  data?.projects?.[0].projects -
                  data?.projects?.[1].projects +
                  " new Projects since yesterday.",
              },
              {
                title: "Blocks",
                stats: data?.blocks.total,
                description:
                  "out of which " + data?.blocks.done + " Blocks are done.",
              },
              {
                title: "Districts",
                stats: data?.districts.count,
                description: "in " + data?.districts.boroughs + " Boroughs",
              },
            ]}
          />
        </Grid.Col>
        <Grid.Col sm={6} lg={4}>
          <Skeleton visible={!data} style={{ height: "100%" }}>
            <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                Progress by Borough
              </Text>
              <BarChart
                dataset={{
                  label: "Progress by Distrct",
                  labels: data?.districts.progress.map((d: any) => d.name),
                  data:
                    data &&
                    data?.districts.progress.map((d: any) => d.progress),
                }}
                height={"160px"}
              />
              <Button<"a">
                mt="md"
                fullWidth
                variant="outline"
                href={"/districts"}
                component="a"
              >
                Open District Overview
              </Button>
            </Paper>
          </Skeleton>
        </Grid.Col>
        <Grid.Col sm={6} lg={4}>
          <Skeleton visible={!data} style={{ height: "100%" }}>
            <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                Projects on Building Servers
              </Text>
              <LineChart
                dataset={{
                  label: "Projects",
                  labels: data?.projects
                    .slice()
                    .reverse()
                    .map((p: any) => p.date),
                  data: data?.projects
                    .slice()
                    .reverse()
                    .map((p: any) => p.projects),
                }}
                height={"160px"}
              />
              <Button<"a">
                mt="md"
                fullWidth
                variant="outline"
                href={"/projects"}
                component="a"
              >
                Open Project List
              </Button>
            </Paper>
          </Skeleton>
        </Grid.Col>
        <Grid.Col sm={6} lg={4}>
          <Skeleton visible={!data} style={{ height: "100%" }}>
            <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                Players on the Network
              </Text>
              <LineChart
                dataset={{
                  label: "Players",
                  labels: data?.players
                    .slice()
                    .reverse()
                    .map((p: any) => p.date),
                  data: data?.players
                    .slice()
                    .reverse()
                    .map((p: any) => p.averages.total),
                }}
                height={"160px"}
              />
              <Button<"a">
                mt="md"
                fullWidth
                variant="outline"
                href={"/network"}
                component="a"
              >
                Open Network Statistics
              </Button>
            </Paper>
          </Skeleton>
        </Grid.Col>
      </Grid>
    </Page>
  );
};

export default Home;
