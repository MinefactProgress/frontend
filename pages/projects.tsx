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
  Badge,
  Button,
  Grid,
  NumberInput,
  Paper,
  RangeSlider,
  ScrollArea,
  Table,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { Calendar, Number0 } from "tabler-icons-react";

import { DatePicker } from "@mantine/dates";
import { Line } from "react-chartjs-2";
import Page from "../components/Page";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import useSWR from "swr";
import { useState } from "react";
import useUser from "../utils/hooks/useUser";

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

const ProjectsPage = () => {
  const theme = useMantineTheme();
  const [user] = useUser();
  const { data } = useSWR("/api/projects/get");
  var projects: any = { labels: [], datasets: [] };
  var reverseData: any = null;
  if (data && !reverseData) {
    reverseData = data.slice().reverse();
  }
  const daysSinceStart = Math.floor(
    (new Date().getTime() - new Date("2020-04-13").getTime()) /
      (1000 * 3600 * 24)
  );
  const [rangeValue, setRangeValue] = useState<[number, number]>([
    daysSinceStart - 30,
    daysSinceStart - 1,
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  data?.slice(rangeValue[0] - 1, rangeValue[1]+2).forEach((element: any) => {
    projects.labels.push(new Date(element.date).toLocaleDateString());
    projects.datasets.push(element.projects);
  });
  const form = useForm({
    initialValues: {
      projects: 0,
    },
  });
  const handleSubmit = async (e: any) => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/projects/set", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: user.apikey,
        projects: form.values.projects,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          showNotification({
            title: "Error Adding Projects",
            message: res.message,
            color: "red",
            icon: <Number0 />,
          });
        } else {
          form.reset();
          showNotification({
            title: "Projects Updated",
            message: "The number of projects has been updated successfully",
            color: "green",
            icon: <Number0 />,
          });
        }
      });
  };

  return (
    <Page>
      <Grid>
        <Grid.Col sm={12} md={7}>
          <Paper
            withBorder
            radius="md"
            p="xs"
            style={{
              marginBottom: theme.spacing.md,
            }}
          >
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Project Diagram
            </Text>
            <Line
              options={{
                responsive: true,
                scales: {
                  x: {
                    grid: {
                      display: true,
                      color: "#D6336C33",
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
              height={"115px"}
              data={{
                labels: projects.labels,
                datasets: [
                  {
                    label: projects ? "Projects" : "",
                    data: projects.datasets,
                    borderColor: "#D6336C",
                    tension: 0.1,
                    fill: true,
                    backgroundColor: "#D6336C10",
                    borderWidth: 2,
                  },
                ],
              }}
            />
            <Text
              color="dimmed"
              size="xs"
              weight={600}
              style={{
                marginTop: theme.spacing.sm,
                marginBottom: theme.spacing.xs,
              }}
            >
              Change Range
            </Text>
            <RangeSlider
              value={rangeValue}
              onChange={setRangeValue}
              min={1}
              max={data?.length}
              label={(val) =>
                new Date(data[val - 1]?.date).toLocaleDateString()
              }
              color="pink"
            />
          </Paper>
          <Paper withBorder radius="md" p="xs">
            <Text
              color="dimmed"
              size="xs"
              transform="uppercase"
              weight={700}
              style={{ marginBottom: theme.spacing.md }}
            >
              Search for a Date
            </Text>
            <DatePicker
              maxDate={new Date()}
              placeholder="Choose Date"
              icon={<Calendar size={16} />}
              value={selectedDate}
              onChange={(date: any) => {
                setSelectedDate(date);
              }}
              style={{ marginBottom: theme.spacing.md }}
            />
            <Text color="dimmed">Total Projects: </Text>
            <Text>
              {
                data?.filter(
                  (item: any) =>
                    new Date(item.date).toLocaleDateString() ===
                    selectedDate.toLocaleDateString()
                )[0].projects
              }
            </Text>
          </Paper>
          {(user.permission || 0) >= 2 && (
            <Paper
              withBorder
              radius="md"
              p="xs"
              style={{
                marginTop: theme.spacing.md,
              }}
            >
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                Add Projects for Today
              </Text>
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <NumberInput
                  label="Projects"
                  name="projects"
                  placeholder="Enter Number of Projects"
                  style={{
                    marginTop: theme.spacing.md,
                  }}
                  {...form.getInputProps("projects")}
                />
                <Button
                  type="submit"
                  fullWidth
                  style={{
                    marginTop: theme.spacing.md,
                  }}
                >
                  Add
                </Button>
              </form>
            </Paper>
          )}
        </Grid.Col>
        <Grid.Col sm={12} md={5}>
          <Paper
            withBorder
            radius="md"
            p="xs"
            style={{
              marginBottom: theme.spacing.md,
            }}
          >
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Project List
            </Text>
            <ScrollArea style={{ height: "86vh" }}>
              <Table highlightOnHover>
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 99,
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[7]
                        : "#FFFFFF",
                  }}
                >
                  <tr>
                    <th>Date</th>
                    <th>Total Projects</th>
                  </tr>
                </thead>
                <tbody>
                  {reverseData
                    ? reverseData.map((item: any, i: number) => (
                        <tr
                          key={i}
                          style={{
                            backgroundColor:
                              i == 0
                                ? theme.colorScheme == "dark"
                                  ? theme.colors.dark[4]
                                  : theme.colors.gray[2]
                                : undefined,
                          }}
                        >
                          <td>{new Date(item.date).toLocaleDateString()} {i == 0?"(Today)":null}</td>
                          <td>
                            {item.projects}
                            <Badge
                              color={
                                !isNaN(
                                  item.projects - reverseData[i + 1]?.projects
                                ) &&
                                item.projects - reverseData[i + 1]?.projects > 0
                                  ? "green"
                                  : "red"
                              }
                              style={{ marginLeft: theme.spacing.md }}
                            >
                              {!isNaN(
                                item.projects - reverseData[i + 1]?.projects
                              )
                                ? "+ " +
                                  (item.projects - reverseData[i + 1]?.projects)
                                : "+ 0"}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </Table>
            </ScrollArea>
          </Paper>
        </Grid.Col>
      </Grid>
    </Page>
  );
};
export default ProjectsPage;
