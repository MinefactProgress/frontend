import {
  ActionIcon,
  Badge,
  Button,
  Grid,
  Group,
  Paper,
  Text,
  Title,
  Tooltip,
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
import {
  Building,
  BuildingCommunity,
  Calendar,
  ChartBubble,
  Checkbox,
  X,
} from "tabler-icons-react";
import { Bar, Line } from "react-chartjs-2";
import { useMediaQuery } from "@mantine/hooks";

import Map from "../components/Map";
import MapLayer from "../components/MapLayer";
import type { NextPage } from "next";
import Page from "../components/Page";
import StatsText from "../components/StatsText";
import { colorFromStatus } from "../utils/blockUtils";
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
    district: { id: 0, name: null },
    status: -1,
    progress: 0,
    details: false,
    builder: "",
    completionDate: null,
    area: "[]",
  });
  const theme = useMantineTheme();
  const smallScreen = useMediaQuery("(max-width: 768px)");
  const { data } = useSWR("/api/blocks/get");
  const { data: districts } = useSWR("/api/districts/get");
  const { data: playersRw } = useSWR("/api/playerstats/get");
  const { data: projectsRw } = useSWR("/api/projects/get");
  var projects: any = { labels: [], datasets: [] };
  var players: any = { labels: [], datasets: [] };
  const nyc = districts?.find(
    (district: any) => district.name === "New York City"
  );
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
      <div
        style={{
          width: "100%",
          height: "calc(100vh - 60px)",
          position: "relative",
        }}
      >
        <Group
          position="right"
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
            variant={
              selectedBlock.status == 0 || selectedBlock.status == 1
                ? "filled"
                : "dot"
            }
            style={{
              backgroundColor:
                selectedBlock.status != 0 && selectedBlock.status != 1
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
            variant={
              selectedBlock.status == 2 || selectedBlock.status == 3
                ? "filled"
                : "dot"
            }
            style={{
              backgroundColor:
                selectedBlock.status != 2 && selectedBlock.status != 3
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
                    district: { id: 0, name: null },
                    status: -1,
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
                router.push(
                  "/districts/" +
                    districts[selectedBlock.district.id - 1].name +
                    "/" +
                    selectedBlock.id
                );
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
          zoom={13}
          defaultLayerName="Block Borders"
          defaultLayerChecked={router.query.d}
          polygon={{ data: data?.area || [] }}
          mapStyle={{ zIndex: 0 }}
          components={data?.map((block: any) =>
            block.location != "[]"
              ? {
                  type: "polygon",
                  positions: block.area,
                  options: {
                    color: `${colorFromStatus(block.status, true)}FF`,
                    opacity:
                      selectedBlock.uid != 0
                        ? block.uid == selectedBlock.uid
                          ? 1
                          : 0.05
                        : 0.5,
                  },
                  radius: 15,
                  tooltip:
                    (districts ? districts[block.district.id - 1].name : "") +
                    " #" +
                    block.id +
                    " | " +
                    (block.status == 1 ? block.builder : block.progress + "%"),
                  eventHandlers: {
                    click: () => {
                      setSelectedBlock(block);
                    },
                  },
                }
              : null
          )}
        >
          <MapLayer
            name="District Borders"
            checked={router.query.d != null}
            components={districts?.map((district: any) =>
              district.location != [] && district.id > 1
                ? {
                    type: "polygon",
                    positions: district.area,
                    options: {
                      color: `${colorFromStatus(district.status, true)}FF`,
                      opacity:
                        selectedBlock.uid != 0
                          ? district.id == selectedBlock.district
                            ? 1
                            : 0.1
                          : 1,
                    },
                    radius: 15,
                    tooltip: `${district.name}`,
                    eventHandlers: {
                      click: () => {
                        router.push("/districts/" + district.name);
                      },
                    },
                  }
                : null
            )}
          />
        </Map>
      </div>
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
          <Title>BTE NYC Progress Tracking</Title>
          <Text>
            We are tracking the Progress made on the BTE New York City building
            Project.
          </Text>
        </Paper>
        <Grid columns={25} sx={{ marginTop: theme.spacing.md }}>
          <Grid.Col sm={5}>
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
          </Grid.Col>
          <Grid.Col sm={5}>
            <StatsText
              title="Total Progress"
              style={{ height: "100%" }}
              icon={<ChartBubble />}
            >
              {Math.round(nyc?.progress * 100) / 100}%
            </StatsText>
          </Grid.Col>
          <Grid.Col sm={5}>
            <StatsText
              title="Completed Projects"
              style={{ height: "100%" }}
              icon={<Building />}
            >
              {projectsRw?.[projectsRw?.length - 1].projects} Projects
            </StatsText>
          </Grid.Col>
          <Grid.Col sm={5}>
            <StatsText
              title="Completed Blocks"
              style={{ height: "100%" }}
              icon={<Checkbox />}
            >
              {nyc?.blocks.done} Blocks
            </StatsText>
          </Grid.Col>
          <Grid.Col sm={5}>
            <StatsText
              title="Total Blocks"
              style={{ height: "100%" }}
              icon={<BuildingCommunity />}
            >
              {nyc?.blocks.total} Blocks
            </StatsText>
          </Grid.Col>
        </Grid>
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
            height={smallScreen ? "120px" : "38px"}
            data={{
              labels: [nyc?.name].concat(
                districts
                  ?.filter((d: any) => d.parent === nyc?.id)
                  .map((d: any) => d.name)
              ),
              datasets: [
                {
                  label: "Progress",
                  data: nyc
                    ? [nyc?.progress].concat(
                        districts
                          ?.filter((d: any) => d.parent === nyc?.id)
                          .map((d: any) => d.progress)
                      )
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
        </Paper>
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
            height={smallScreen ? "160px" : "50px"}
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
            height={smallScreen ? "160px" : "50px"}
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
