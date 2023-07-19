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
  Grid,
  Paper,
  RangeSlider,
  ScrollArea,
  Skeleton,
  Stack,
  Table,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  IconArrowDownRight,
  IconArrowRight,
  IconArrowUpRight,
  IconBuildingSkyscraper,
  IconTable,
} from "@tabler/icons";
import { ProgressCard, StatsText } from "../components/Stats";

import { LineChart } from "../components/charts/LineChart";
import { Page } from "../components/Page";
import { getDayOfYear } from "../util/time";
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
const Projects = () => {
  const { data } = useSWR("/v1/projects");
  const theme = useMantineTheme();
  const milestone = {
    lastValue: data && data[data.length - 2].projects,
    currentValue: data && data[data.length - 1].projects,
    nextMilestone:
      data && Math.ceil(data[data.length - 1].projects / 1000) * 1000,
  };
  const dates = {
    month: {
      name: new Date().toLocaleString("default", { month: "long" }),
      daysIn: new Date().getDate(),
    },
  };

  return (
    <Page name="Projects" icon={<IconTable />}>
      <Grid>
        <Grid.Col span={6}>
          <Stack>
            <Skeleton visible={!data} style={{ height: "100%" }}>
              <StatsText
                title="Total Projects"
                diff={(
                  (milestone.currentValue - milestone.lastValue) /
                  milestone.currentValue
                ).toFixed(5)}
                icon={IconBuildingSkyscraper}
                subtitle="since yesterday"
              >
                {milestone.currentValue}
              </StatsText>
            </Skeleton>
            <Skeleton visible={!data} style={{ height: "100%" }}>
              <ProgressCard
                title="Next Milestone"
                descriptor="Projects"
                value={
                  milestone.currentValue - (milestone.nextMilestone - 1000)
                }
                valueDisplay={milestone.currentValue}
                maxDisplay={milestone.nextMilestone}
                max={1000}
                style={{ height: "100%" }}
              />
            </Skeleton>
            <Skeleton visible={!data} style={{ height: "100%" }}>
              <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
                <Text
                  color="dimmed"
                  size="xs"
                  transform="uppercase"
                  weight={700}
                >
                  Projects in the month of {dates.month.name}
                </Text>
                <LineChart
                  dataset={{
                    label: "Projects",
                    labels: data
                      ?.slice(-dates.month.daysIn)
                      .map((p: any) => new Date(p.date).toLocaleDateString()),
                    data: data
                      ?.slice(-dates.month.daysIn)
                      .map((p: any) => p.projects),
                  }}
                  height={"160px"}
                />
              </Paper>
            </Skeleton>
          </Stack>
        </Grid.Col>
        <Grid.Col span={6}>
          <Skeleton visible={!data} style={{ height: "100%" }}>
            <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                Progress by Borough
              </Text>
              <ScrollArea style={{ height: "94vh" }} type="always">
                <Table highlightOnHover>
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Date</th>
                      <th>Total Projects</th>
                      <th>Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data
                      ?.slice()
                      .reverse()
                      .map((project: any, i: number) => {
                        const diff =
                          project.projects -
                          (data[data.length - i - 2]?.projects || 0);
                        const DiffIcon =
                          (diff || 0) > 0 ? IconArrowUpRight : IconArrowRight;
                        return (
                          <tr key={i}>
                            <td>{data.length - i}</td>
                            <td>
                              {new Date(project.date).toLocaleDateString()}
                            </td>
                            <td>
                              {Intl.NumberFormat().format(project.projects)}
                            </td>
                            <td>
                              <Text
                                color={diff > 0 ? "teal" : "yellow"}
                                size={"md"}
                                style={{
                                  lineHeight: 1,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <span>
                                  {diff > 0 ? "+" : ""}
                                  {Intl.NumberFormat().format(diff)}
                                </span>
                                <DiffIcon />
                              </Text>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </ScrollArea>
            </Paper>
          </Skeleton>
        </Grid.Col>
      </Grid>
    </Page>
  );
};

export default Projects;
