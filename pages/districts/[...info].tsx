import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Checkbox,
  Grid,
  Group,
  Modal,
  Paper,
  Progress,
  ScrollArea,
  Slider,
  Table,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import {
  ArcElement,
  BarElement,
  Tooltip as CTooltip,
  CategoryScale,
  Chart as ChartJS,
  Title as ChartTitle,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
} from "chart.js";
import { Check, Edit, X } from "tabler-icons-react";
import {
  colorFromStatus,
  progressToColorName,
  statusToColorName,
  statusToName,
} from "../../utils/blockUtils";

import { Bar } from "react-chartjs-2";
import Map from "../../components/Map";
import Page from "../../components/Page";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useState } from "react";
import useUser from "../../utils/hooks/useUser";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  CTooltip,
  Legend,
  Filler,
  ArcElement
);

const DistrictPage = () => {
  const theme = useMantineTheme();
  const router = useRouter();
  const [blockOpened, setBlockOpened] = useState(false);
  const [statusFilter, setStatusFilter] = useState<number | null | undefined>(
    undefined
  );
  if (router.query.f && statusFilter === null) {
    setStatusFilter(parseInt(router.query.f as string));
  }
  const { info } = router.query;
  const district = info?.at(0);
  const [user] = useUser();
  const { data } = useSWR("/api/districts/get/" + district);
  const selBlock = info?.at(1)
    ? data?.blocks.blocks.find(
        (b: any) => b.id === parseInt(info?.at(1) || "1")
      )
    : undefined;
  const handleClick = (blockID: any) => {
    router.push("/districts/" + district + "/" + blockID);
    if ((user.permission || 0) >= 1) {
      editForm.setValues({
        progress: selBlock?.progress,
        details: selBlock?.details,
        builders: selBlock?.builders.map((b: any) => b),
      });
      setBlockOpened(true);
    }
  };
  const handleSubtmit = (values: any) => {
    fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/blocks/update?key=" + user.apikey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          district: data?.name,
          blockID: selBlock.id,
          values: {
            progress: values.progress,
            details: values.details,
            builder: values.builders.join(","),
          },
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          showNotification({
            title: "Error Updating Block",
            message: res.message,
            color: "red",
          });
        } else {
          showNotification({
            title: "Block Updated",
            message: "The data of Block " + selBlock.id + " has been updated",
            color: "green",
            icon: <Check />,
          });
        }
      });
  };
  const editForm = useForm({
    initialValues: {
      progress: 0,
      details: false,
      builders: [""],
    },
  });

  return (
    <Page title={data?.name}>
      <Modal
        centered
        opened={blockOpened}
        onClose={() => setBlockOpened(false)}
        title={data?.name + " Block " + selBlock?.id}
      >
        <form onSubmit={editForm.onSubmit(handleSubtmit)}>
          <Slider
            label={(value) => `Progress ${value}%`}
            min={0}
            max={100}
            step={5}
            color={progressToColorName(editForm.values.progress)}
            marks={[{ value: 25 }, { value: 50 }, { value: 75 }]}
            {...editForm.getInputProps("progress")}
          />
          <Checkbox
            label="Details"
            disabled={editForm.values.progress != 100}
            color="green"
            style={{
              marginTop: theme.spacing.md,
              marginBottom: theme.spacing.md,
            }}
            {...editForm.getInputProps("details")}
          />
          <Button
            fullWidth
            color={progressToColorName(editForm.values.progress)}
            onClick={(e: any) => {
              if (
                !editForm.values.builders.includes(
                  user.username || "wf8whopiw8ghjZH)h"
                )
              ) {
                const newBuilders = editForm.values.builders;
                newBuilders.push(user.username || "");
                editForm.setFieldValue("builders", newBuilders);
              } else {
                const newBuilders = editForm.values.builders;
                newBuilders.splice(
                  newBuilders.indexOf(user.username || "fwetwg"),
                  1
                );
                editForm.setFieldValue(
                  "builders",
                  editForm.values.builders?.filter(
                    (b: any) => b !== user.username
                  )
                );
              }

              console.log(editForm.values.builders);
            }}
          >
            {editForm.values.builders?.includes(user.username || "di3w8fal")
              ? "Unclaim Block"
              : "Claim Block"}
          </Button>
          <Button
            type="submit"
            fullWidth
            style={{ marginTop: theme.spacing.md }}
          >
            Update
          </Button>
        </form>
      </Modal>
      <Grid>
        <Grid.Col span={8}>
          <Paper
            withBorder
            radius="md"
            p="xs"
            style={{
              marginBottom: theme.spacing.md,
            }}
          >
            <Title>{district}</Title>
            <Progress
              size="xl"
              value={data?.progress}
              color={progressToColorName(data?.progress)}
              label={data?.progress.toFixed(2) + "%"}
            />
          </Paper>
          <Paper
            withBorder
            radius="md"
            p="xs"
            style={{
              marginBottom: theme.spacing.md,
            }}
          >
            <div style={{ width: "100%" }}>
              <Text
                color="dimmed"
                size="xs"
                transform="uppercase"
                weight={700}
                style={{ display: "inline-block" }}
              >
                Blocks
              </Text>
              <Group style={{ float: "right" }}>
                {user.uid > 0 ? (
                  <Badge
                    variant={statusFilter === 5 ? "filled" : "outline"}
                    onClick={(e: any) => {
                      setStatusFilter(5);
                      router.push("/districts/" + data?.name + "?f=" + 5);
                    }}
                  >
                    My Claims
                  </Badge>
                ) : null}

                {[4, 3, 2, 1, 0].map((status) => (
                  <Badge
                    key={status}
                    color={statusToColorName(status)}
                    variant={statusFilter === status ? "filled" : "outline"}
                    onClick={(e: any) => {
                      setStatusFilter(status);
                      router.push("/districts/" + data?.name + "?f=" + status);
                    }}
                  >
                    {statusToName(status)}
                  </Badge>
                ))}
                {statusFilter !== undefined ? (
                  <Tooltip
                    label="Clear Filter"
                    placement="end"
                    withArrow
                    position="bottom"
                  >
                    <ActionIcon
                      size="xs"
                      radius="xl"
                      variant="outline"
                      onClick={() => {
                        setStatusFilter(undefined);
                        router.push("/districts/" + data?.name);
                      }}
                    >
                      <X size={16} />
                    </ActionIcon>
                  </Tooltip>
                ) : null}
              </Group>
            </div>
            <ScrollArea style={{ height: "75vh" }}>
              <Table highlightOnHover>
                <thead>
                  <tr>
                    <th>Block ID</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Details</th>
                    <th>Builder</th>
                    <th>Completion Date</th>
                    {(user.permission || 0) >= 1 && <th></th>}
                  </tr>
                </thead>
                <tbody>
                  {data
                    ? data?.blocks.blocks
                        .filter((block: any) =>
                          statusFilter != null
                            ? statusFilter === 5
                              ? block.builders.includes(user.username)
                              : block.status == statusFilter
                            : true
                        )
                        .map((block: any, i: number) => (
                          <tr
                            key={i}
                            style={{
                              backgroundColor:
                                selBlock?.uid == block.uid
                                  ? theme.colorScheme == "dark"
                                    ? theme.colors.dark[4]
                                    : theme.colors.gray[2]
                                  : undefined,
                            }}
                          >
                            <td>{block.id}</td>
                            <td>
                              <Badge color={statusToColorName(block.status)}>
                                {statusToName(block.status)}
                              </Badge>
                            </td>
                            <td>
                              <Center>{block.progress.toFixed(2) + "%"}</Center>
                              <Progress
                                size="sm"
                                value={block.progress}
                                color={progressToColorName(block.progress)}
                              />
                            </td>
                            <td>
                              <Center>
                                <Checkbox
                                  color="green"
                                  checked={block.details}
                                />
                              </Center>
                            </td>
                            <td>{block.builders.join(", ")}</td>
                            <td>
                              {!block.completionDate
                                ? "---"
                                : new Date(
                                    block.completionDate
                                  ).toLocaleDateString()}
                            </td>
                            {(user.permission || 0) >= 1 && (
                              <td>
                                <ActionIcon
                                  onClick={(e: any) => handleClick(block.id)}
                                >
                                  <Edit size={20} />
                                </ActionIcon>
                              </td>
                            )}
                          </tr>
                        ))
                    : null}
                </tbody>
              </Table>
            </ScrollArea>
          </Paper>
        </Grid.Col>
        <Grid.Col span={4}>
          <Paper
            withBorder
            radius="md"
            p="xs"
            style={{
              height: "40%",
              marginBottom: theme.spacing.md,
            }}
          >
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Map
            </Text>
            <Map
              width="100%"
              height="94%"
              style={{ zIndex: 0 }}
              zoom={14}
              center={
                data?.center?.length > 0
                  ? data?.center
                  : data?.blocks.blocks[0].area[0]
              }
              polygon={{ data: data?.area || [] }}
              components={data?.blocks.blocks.map((block: any) =>
                block.area.length !== 0
                  ? {
                      type: "polygon",
                      positions: block.area,
                      options: {
                        color: `${colorFromStatus(block.status)}FF`,
                        opacity: selBlock
                          ? selBlock?.uid == block?.uid
                            ? 1
                            : 0.05
                          : 0.5,
                      },
                      radius: 15,
                      tooltip: "Block #" + block.id,
                      eventHandlers: {
                        click: () => {
                          handleClick(block.id);
                        },
                      },
                    }
                  : null
              )}
            />
          </Paper>
          <Paper
            withBorder
            radius="md"
            p="xs"
            style={{
              marginBottom: theme.spacing.md,
              paddingBottom: 6,
            }}
          >
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Status Count
            </Text>
            <Bar
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
                      display: true,
                      drawBorder: false,
                      color: "#9848d533",
                    },
                    min: 0,
                    max: data?.blocks.blocks.length,
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                    labels: {
                      boxWidth: 35,
                    },
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
                labels: [""],
                datasets: [
                  {
                    label: "Done",
                    data: [
                      data?.blocks.blocks.filter((b: any) => b.status === 4)
                        .length,
                    ],
                    backgroundColor: theme.colors.green[7] + "0f",
                    borderColor: theme.colors.green[7],
                    borderWidth: 2,
                  },
                  {
                    label: "Detailing",
                    data: [
                      data?.blocks.blocks.filter((b: any) => b.status === 3)
                        .length,
                    ],
                    backgroundColor: theme.colors.yellow[7] + "0f",
                    borderColor: theme.colors.yellow[7],
                    borderWidth: 2,
                  },
                  {
                    label: "Building",
                    data: [
                      data?.blocks.blocks.filter((b: any) => b.status === 2)
                        .length,
                    ],
                    backgroundColor: theme.colors.orange[7] + "0f",
                    borderColor: theme.colors.orange[7],
                    borderWidth: 2,
                  },
                  {
                    label: "Reserved",
                    data: [
                      data?.blocks.blocks.filter((b: any) => b.status === 1)
                        .length,
                    ],
                    backgroundColor: theme.colors.cyan[7] + "0f",
                    borderColor: theme.colors.cyan[7],
                    borderWidth: 2,
                  },
                  {
                    label: "Not Started",
                    data: [
                      data?.blocks.blocks.filter((b: any) => b.status === 0)
                        .length,
                    ],
                    backgroundColor: theme.colors.red[7] + "0f",
                    borderColor: theme.colors.red[7],
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
            style={{
              marginBottom: theme.spacing.md,
            }}
          >
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Top 3 Builders
            </Text>
            <Table>
              <thead>
                <tr>
                  <th>Ranking</th>
                  <th>Builder</th>
                  <th>Claims</th>
                </tr>
              </thead>
              <tbody>
                {data
                  ? data?.builders
                      .slice(0, 3)
                      .map((builder: any, i: number) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{builder.name}</td>
                          <td>{builder.blocks}</td>
                        </tr>
                      ))
                  : null}
              </tbody>
            </Table>
          </Paper>
        </Grid.Col>
      </Grid>
    </Page>
  );
};

export default DistrictPage;
