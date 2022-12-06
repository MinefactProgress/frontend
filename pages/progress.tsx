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
  const { data } = useSWR("/v1/progress");

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
                stats: data?.projects?.[data?.projects?.length - 1].projects,
                description:
                  data?.projects?.[data?.projects?.length - 1].projects -
                  data?.projects?.[data?.projects?.length - 2].projects +
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
        <Grid.Col xs={4}>
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
              <Button mt="md" fullWidth variant="outline">
                Open District Overview
              </Button>
            </Paper>
          </Skeleton>
        </Grid.Col>
        <Grid.Col xs={4}>
          <Skeleton visible={!data} style={{ height: "100%" }}>
            <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                Projects on Building Servers
              </Text>
              <LineChart
                dataset={{
                  label: "Projects",
                  labels: data?.projects.map((p: any) => p.date),
                  data: data?.projects.map((p: any) => p.projects),
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
          <Skeleton visible={!data} style={{ height: "100%" }}>
            <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                Players on the Network
              </Text>
              <LineChart
                dataset={{
                  label: "Players",
                  labels: data?.players.map((p: any) => p.date),
                  data: data?.players.map((p: any) => p.averages.total),
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
