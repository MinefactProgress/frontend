import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Text,
  Title,
  Tooltip,
  useMantineTheme
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
  PointElement
} from "chart.js";
import {
  Backhoe,
  BuildingCommunity,
  Calendar,
  ChartBubble,
  Users,
  X
} from "tabler-icons-react";
import { Bar, Line } from "react-chartjs-2";

import Map from "../components/Map";
import type { NextPage } from "next";
import Page from "../components/Page";
import StatsText from "../components/StatsText";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useState } from "react";

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

const Home: NextPage = ({ user, setUser }: any) => {
  const router = useRouter();
  const [selectedBlock, setSelectedBlock] = useState({
    uid: 0,
    id: 0,
    district: 1,
    status: 1,
    progress: 0,
    details: false,
    builder: "",
    completionDate: null,
    area: "[]",
  });
  const theme = useMantineTheme();
  const { data } = useSWR("http://142.44.137.53:8080/api/blocks/get");
  const { data: districts } = useSWR(
    "http://142.44.137.53:8080/api/districts/get"
  );
  const { data: progress } = useSWR("http://142.44.137.53:8080/api/progress");
  const { data: playersRw } = useSWR(
    "http://142.44.137.53:8080/api/playerstats/get"
  );
  const { data: projectsRw } = useSWR(
    "http://142.44.137.53:8080/api/projects/get"
  );
  var projects: any = { labels: [], datasets: [] };
  var players: any = { labels: [], datasets: [] };
  projectsRw?.slice(-30).forEach((element: any) => {
    projects.labels.push(new Date(element.date).toLocaleDateString());
    projects.datasets.push(element.projects);
  });
  playersRw?.slice(-30).forEach((element: any) => {
    players.labels.push(new Date(element.date).toLocaleDateString());
    players.datasets.push(element.averages.total);
  });

  return (
    <Page noMargin style={{ position: "relative" }}>
      {/* Head Map */}
      <Group
        style={{
          position: "absolute",
          zIndex: 2,
          top: theme.spacing.md,
          right: theme.spacing.md,
        }}
      >
        <Badge
          color="red"
          size="lg"
          variant={selectedBlock.status == 0 ? "filled" : "dot"}
          style={{
            backgroundColor:
              selectedBlock.status != 0
                ? theme.colorScheme === "dark"
                  ? "black"
                  : "white"
                : undefined,
          }}
        >
          Not Started
        </Badge>
        <Badge
          color="yellow"
          size="lg"
          variant={selectedBlock.status == 2 ? "filled" : "dot"}
          style={{
            backgroundColor:
              selectedBlock.status != 2
                ? theme.colorScheme === "dark"
                  ? "black"
                  : "white"
                : undefined,
          }}
        >
          Building
        </Badge>
        <Badge
          color="green"
          size="lg"
          variant={selectedBlock.status == 4 ? "filled" : "dot"}
          style={{
            backgroundColor:
              selectedBlock.status != 4
                ? theme.colorScheme === "dark"
                  ? "black"
                  : "white"
                : undefined,
          }}
        >
          Completed
        </Badge>
        {selectedBlock.uid != 0 && (
          <Tooltip
            label="Clear selection"
            withArrow
            placement="start"
            position="bottom"
          >
            <ActionIcon
              size="sm"
              radius="xl"
              variant="outline"
              style={{
                backgroundColor:
                  theme.colorScheme === "dark" ? "black" : "white",
              }}
              onClick={() => {
                setSelectedBlock({
                  uid: 0,
                  id: 0,
                  district: 1,
                  status: 1,
                  progress: 0,
                  details: false,
                  builder: "",
                  completionDate: null,
                  area: "[]",
                });
              }}
            >
              <X size={16} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
      <Group
        style={{
          position: "absolute",
          zIndex: 2,
          bottom: theme.spacing.md,
          width: "100%",
        }}
        position="center"
      >
        <Button
          variant={selectedBlock.uid != 0 ? "light" : "filled"}
          color="gray"
          radius="xl"
          size="md"
          onClick={() => {
            router.push("#i");
          }}
          style={{
            boxShadow: theme.shadows.md,
          }}
        >
          View More
        </Button>
        {selectedBlock.uid != 0 && (
          <Button
            variant="filled"
            color="gray"
            radius="xl"
            size="md"
            onClick={() => {
              router.push("#bInfo");
            }}
            style={{
              boxShadow: theme.shadows.md,
            }}
          >
            View Block Stats
          </Button>
        )}
      </Group>
      <Map
        width="100%"
        height="100%"
        noScroll
        zoom={13}
        polygon={{ data: data?.area || [] }}
        mapStyle={{ zIndex: 0 }}
        components={data?.map((block: any) =>
          block.location != "[]"
            ? {
                type: "polygon",
                positions: JSON.parse(block.area),
                options: {
                  color: `rgba(${
                    block.progress == 0
                      ? "240, 62, 62"
                      : block.progress < 100
                      ? "255, 212, 59"
                      : "55, 178, 77"
                  })`,
                  opacity:
                    selectedBlock.uid != 0
                      ? block.uid == selectedBlock.uid
                        ? 1
                        : 0.05
                      : 0.5,
                },
                radius: 15,
                tooltip:
                  (districts ? districts[block.district - 1].name : "") +
                  " #" +
                  block.id +
                  " | " +
                  block.progress +
                  "%",
                eventHandlers: {
                  click: () => {
                    setSelectedBlock(block);
                  },
                },
              }
            : null
        )}
      ></Map>
      {/* Content */}
      <div style={{ margin: theme.spacing.md }} id="i">
        <Paper
          withBorder
          radius="md"
          p="xs"
          style={{
            marginTop: theme.spacing.md,
            marginBottom: theme.spacing.md,
          }}
        >
          <Title>Minefact Progress Tracking</Title>
          <Text>
            We are tracking the Progress made on the Minefact New York City
            building Project.
          </Text>
        </Paper>
        <SimpleGrid cols={5} spacing="md" sx={{ marginTop: theme.spacing.md }}>
          <StatsText
            title="Tracking since"
            style={{ height: "100%" }}
            icon={<Calendar />}
          >
            {Math.floor(
              (new Date().getTime() - new Date("2020-04-13").getTime()) /
                (1000 * 3600 * 24)
            )}{" "}
            Days
          </StatsText>
          <StatsText
            title="Total Progress"
            style={{ height: "100%" }}
            icon={<ChartBubble />}
          >
            {Math.round(progress?.progress)}%
          </StatsText>
          <StatsText
            title="Helping hands"
            style={{ height: "100%" }}
            icon={<Users />}
          >
            {progress?.builders.length} Builders
          </StatsText>
          <StatsText
            title="In-Progress Blocks"
            style={{ height: "100%" }}
            icon={<Backhoe />}
          >
            {progress?.blocksCount.building} Blocks
          </StatsText>
          <StatsText
            title="Total Blocks"
            style={{ height: "100%" }}
            icon={<BuildingCommunity />}
          >
            {progress?.blocksCount.total} Blocks
          </StatsText>
        </SimpleGrid>
        <Paper
          withBorder
          radius="md"
          p="xs"
          style={{ marginTop: theme.spacing.md }}
        >
          <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
            Progress of the project
          </Text>
          <Bar
            options={{
              indexAxis: "y" as const,
              elements: {
                bar: {
                  borderWidth: 1,
                  backgroundColor: "#9848d5",
                },
              },
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: false,
                },
                tooltip: {
                  enabled: true,
                  callbacks: {
                    label: function (tooltipItem) {
                      return Math.round(tooltipItem.parsed.x * 10) / 10 + "%";
                    },
                  },
                },
              },

              scales: {
                x: {
                  grid: {
                    display: true,
                    color: "#9848d533",
                    drawBorder: false,
                    z: 1,
                  },
                  min: 0,
                  max: 100,
                },
                y: {
                  grid: {
                    drawBorder: false,
                    color: "#ffffff00",
                  },
                },
              },
            }}
            height={"38px"}
            data={{
              labels: [
                progress?.name,
                progress?.children[0].name,
                progress?.children[1].name,
              ],
              datasets: [
                {
                  label: "Progress",
                  data: progress
                    ? [
                        progress?.progress,
                        progress?.children[0].progress,
                        progress?.children[1].progress,
                      ]
                    : [],
                  borderColor: function (context) {
                    const index = context.dataIndex;
                    const value = context.dataset.data[index];
                    return value >= 10
                      ? value == 100
                        ? "rgba(55, 178, 77, 1)"
                        : "rgba(255, 212, 59, 1)"
                      : "rgba(240, 62, 62, 1)";
                  },
                  barThickness: 25,
                  minBarLength: 2,
                  backgroundColor: function (context) {
                    const index = context.dataIndex;
                    const value = context.dataset.data[index];
                    return value >= 10
                      ? value == 100
                        ? "rgba(55, 178, 77, 0.06)"
                        : "rgba(255, 212, 59, 0.06)"
                      : "rgba(240, 62, 62, 0.06)";
                  },
                },
              ],
            }}
          />
        </Paper>{" "}
        <Paper
          withBorder
          radius="md"
          p="xs"
          style={{ marginTop: theme.spacing.md }}
        >
          <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
            Projects on Building servers
          </Text>
          <Line
            options={{
              responsive: true,
              scales: {
                x: {
                  grid: {
                    display: true,
                    color: "#ae3ec933",
                    drawBorder: false,
                    z: 1,
                  },
                },
                y: {
                  grid: {
                    drawBorder: false,
                    color: "#ffffff00",
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
            height={"50px"}
            data={{
              labels: projects.labels,
              datasets: [
                {
                  label: projects ? "Projects" : "",
                  data: projects.datasets,
                  borderColor: "#ae3ec9",
                  tension: 0.1,
                  fill: true,
                  backgroundColor: "#ae3ec910",
                  borderWidth: 2,
                },
              ],
            }}
          />
        </Paper>
        <Paper
          withBorder
          radius="md"
          p="xs"
          style={{ marginTop: theme.spacing.md }}
        >
          <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
            Players on the Network
          </Text>
          <Line
            options={{
              responsive: true,
              scales: {
                x: {
                  grid: {
                    display: true,
                    color: "#1098ad33",
                    drawBorder: false,
                    z: 1,
                  },
                },
                y: {
                  grid: {
                    drawBorder: false,
                    color: "#ffffff00",
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
            height={"50px"}
            data={{
              labels: players.labels,
              datasets: [
                {
                  label: players ? "Average Players" : "",
                  data: players.datasets,
                  borderColor: "#1098ad",
                  tension: 0.1,
                  fill: true,
                  backgroundColor: "#1098ad10",
                  borderWidth: 2,
                },
              ],
            }}
          />
        </Paper>
      </div>
    </Page>
  );
};

export default Home;
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
