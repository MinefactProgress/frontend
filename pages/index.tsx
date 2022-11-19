import * as V from "victory";

import {
  ActionIcon,
  Button,
  Center,
  Container,
  Grid,
  Group,
  Paper,
  Skeleton,
  Text,
  Title,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
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
import { Bar, Line } from "react-chartjs-2";
import { IconCalendar, IconHome, IconMoonStars, IconSun } from "@tabler/icons";
import { StatsGroup, StatsText } from "../components/Stats";

import { BarChart } from "../components/charts/BarChart";
import { FastNavigation } from "../components/FastNavigation";
import Head from "next/head";
import Image from "next/image";
import { LineChart } from "../components/charts/LineChart";
import Motd from "../components/Motd";
import type { NextPage } from "next";
import { Page } from "../components/Page";
import useSWR from "swr";

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
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const theme = useMantineTheme();
  // TODO: One route

  const { data } = useSWR("/api/blocks/get");
  const { data: districts } = useSWR("/api/districts/get");
  const { data: playersRw } = useSWR("/api/playerstats/get");
  const { data: projectsRw } = useSWR("/api/projects/get");
  const nyc = districts?.find(
    (district: any) => district.name === "New York City"
  );
  var projects: any = { labels: [], datasets: [] };
  var players: any = { labels: [], datasets: [] };
  projectsRw?.slice(-30).forEach((element: any, i: number) => {
    projects.labels.push(new Date(element.date).toLocaleDateString());
    projects.datasets.push(element.projects);
  });
  playersRw?.slice(-30).forEach((element: any) => {
    players.labels.push(new Date(element.date).toLocaleDateString());
    players.datasets.push(element.averages.total);
  });

  return (
    <Page name="Home" icon={<IconHome />}>
      <Grid>
        <Grid.Col xs={12}>
          <Group position="center">
            <Motd />
          </Group>
        </Grid.Col>
        <Grid.Col xs={7}>
          <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
            <Title>BTE NYC Progress Tracking</Title>
            <Text>
              We are tracking the Progress made on the BTE New York City
              building Project.
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col xs={5}>
          <FastNavigation />
        </Grid.Col>
        <Grid.Col xs={12}>
          <StatsGroup
            data={[
              {
                title: "Projects",
                stats: projectsRw?.[projectsRw?.length - 1].projects,
                description:
                  projectsRw?.[projectsRw?.length - 1].projects -
                  projectsRw?.[projectsRw?.length - 2].projects +
                  " new Projects since yesterday.",
              },
              {
                title: "Blocks",
                stats: nyc?.blocks.total,
                description:
                  "out of which " + nyc?.blocks.done + " Blocks are done.",
              },
              {
                title: "Districts",
                stats: districts?.length,
                description:
                  "in " +
                  districts?.filter((d: any) => d.parent == 1).length +
                  " Boroughs",
              },
            ]}
          />
        </Grid.Col>
        <Grid.Col xs={4}>
          <Skeleton visible={!nyc} style={{ height: "100%" }}>
            <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                Progress by Borough
              </Text>
              <BarChart
                dataset={{
                  label: "Progress by Distrct",
                  labels: districts
                    ?.filter((d: any) => d.parent === nyc?.id)
                    .map((d: any) => d.name),
                  data:
                    nyc &&
                    districts
                      ?.filter((d: any) => d.parent === nyc?.id)
                      .map((d: any) => d.progress),
                }}
                height={"160px"}
              />
              <Button mt="md" fullWidth variant="outline">
                Open District Overview
              </Button>
            </Paper>
          </Skeleton>
        </Grid.Col>
        <Grid.Col xs={4}>
          <Skeleton visible={!nyc} style={{ height: "100%" }}>
            <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                Projects on Building Servers
              </Text>
              <LineChart
                dataset={{
                  label: "Projects",
                  labels: projects.labels,
                  data: projects.datasets,
                }}
                height={"160px"}
              />
              <Button mt="md" fullWidth variant="outline">
                Open Project List
              </Button>
            </Paper>
          </Skeleton>
        </Grid.Col>
        <Grid.Col xs={4}>
          <Skeleton visible={!nyc} style={{ height: "100%" }}>
            <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                Players on the Network
              </Text>
              <LineChart
                dataset={{
                  label: "Players",
                  labels: players.labels,
                  data: players.datasets,
                }}
                height={"160px"}
              />
              <Button mt="md" fullWidth variant="outline">
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
