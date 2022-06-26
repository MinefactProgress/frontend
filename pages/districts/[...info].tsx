import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Checkbox,
  Grid,
  Group,
  Image,
  MediaQuery,
  MultiSelect,
  NumberInput,
  Pagination,
  Paper,
  Progress,
  ScrollArea,
  Table,
  Tabs,
  Text,
  TextInput,
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
import {
  Backhoe,
  BuildingSkyscraper,
  CameraPlus,
  ChartBar,
  Check,
  Cross,
  Edit,
  Hash,
  Map as MapIcon,
  MapPin,
  Photo,
  Users,
  X,
} from "tabler-icons-react";
import {
  colorFromStatus,
  progressToColorName,
  statusToColorName,
  statusToName,
} from "../../utils/blockUtils";

import { Bar } from "react-chartjs-2";
import Map from "../../components/Map";
import Page from "../../components/Page";
import { Permissions } from "../../utils/hooks/usePermission";
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
  const [activePage, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<number | null | undefined>(
    undefined
  );
  if (router.query.f && statusFilter === null) {
    setStatusFilter(parseInt(router.query.f as string));
  }
  const { info } = router.query;
  const district = info?.[0];
  const [user] = useUser();
  const { data } = useSWR("/api/districts/get/" + district);
  const { data: users } = useSWR("/api/users/get");
  const { data: adminsettings } = useSWR(
    "/api/admin/settings/get/custom_builders"
  );
  const [selBlock, setSelBlock] = useState<any>(null);
  if (info?.[1] && selBlock === null && data) {
    setSelBlock(
      data?.blocks.blocks.find((b: any) => b.id === parseInt(info?.[1] || "1"))
    );
  }
  const imageForm = useForm({
    initialValues: {
      image: "",
    },
    validate: {
      image: (value) =>
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
          value
        )
          ? null
          : "Invalid URL",
    },
  });

  const handleClick = (blockID: any) => {
    router.push("/districts/" + district + "/" + blockID);
    setSelBlock(data?.blocks.blocks.find((b: any) => b.id === blockID));
  };
  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (
      selBlock &&
      selBlock != data?.blocks.blocks.find((b: any) => b.id === selBlock?.id)
    ) {
      fetch(
        process.env.NEXT_PUBLIC_API_URL +
          "/api/blocks/update?key=" +
          user.apikey,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            district: data?.name,
            blockID: selBlock?.id,
            values: {
              progress: selBlock?.progress,
              details: selBlock?.details,
              builder: selBlock?.builders.join(","),
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
              message:
                "The data of Block " + selBlock?.id + " has been updated",
              color: "green",
              icon: <Check />,
            });
          }
        });
    } else {
      showNotification({
        title: "Nothing Changed",
        message: "No changes were made to the block",
      });
    }
  };
  const handleLandmarkSubmit = () => {};
  const handleAddImage = async () => {
    const images = data?.image;
    images.push(imageForm.values.image);
    const result = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        "/api/districts/edit?key=" +
        user.apikey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          district: data?.name,
          image: JSON.stringify(images),
        }),
      }
    ).then((res) => res.json());
    if (result.error) {
      showNotification({
        autoClose: 5000,
        title: "Error adding image",
        message: result.message,
        color: "red",
        icon: <Cross />,
      });
    } else {
      showNotification({
        autoClose: 5000,
        title: "Image added",
        message: "The Image has been added successfully",
        color: "green",
        icon: <Check />,
      });
    }
  };
  const handleCopyLocation = (loc: any) => {
    navigator.clipboard.writeText(loc);
    showNotification({
      autoClose: 5000,
      title: "Location copied",
      message: `${loc} copied to your clipboard`,
      color: "green",
      icon: <Check />,
    });
  };

  return (
    <Page title={data?.name}>
      <Grid>
        <Grid.Col sm={8}>
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
              <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
                <Group style={{ float: "right" }}>
                  <Text
                    color="dimmed"
                    size="xs"
                    transform="uppercase"
                    weight={700}
                  >
                    Filter
                  </Text>
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
                        router.push(
                          "/districts/" + data?.name + "?f=" + status
                        );
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
              </MediaQuery>
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
                    <th></th>
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
                            <td>
                              <Group>
                                {block.id}
                                {block.landmarks.length > 0
                                  ? block.landmarks.map((landmark: any) => (
                                      <Tooltip
                                        key={landmark.id}
                                        label={`Landmark | ${landmark.name}`}
                                        withArrow
                                      >
                                        <ActionIcon>
                                          <BuildingSkyscraper
                                            size={20}
                                            color={
                                              landmark.completed
                                                ? "green"
                                                : landmark.builder.length > 0
                                                ? "orange"
                                                : "red"
                                            }
                                          />
                                        </ActionIcon>
                                      </Tooltip>
                                    ))
                                  : null}
                              </Group>
                            </td>
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
                                  readOnly
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
                            <td>
                              <Group>
                                {block.center.length == 2 && (
                                  <Tooltip label="Copy Location" withArrow>
                                    <ActionIcon
                                      onClick={(e: any) =>
                                        handleCopyLocation(block.center)
                                      }
                                    >
                                      <MapPin size={20}></MapPin>
                                    </ActionIcon>
                                  </Tooltip>
                                )}

                                {(user.permission || 0) >=
                                  Permissions.Builder && (
                                  <ActionIcon
                                    onClick={(e: any) => handleClick(block.id)}
                                  >
                                    <Edit size={20} />
                                  </ActionIcon>
                                )}
                              </Group>
                            </td>
                          </tr>
                        ))
                    : null}
                </tbody>
              </Table>
            </ScrollArea>
          </Paper>
        </Grid.Col>
        <Grid.Col sm={4}>
          <Paper
            withBorder
            radius="md"
            p="xs"
            style={{
              height: "48%",
              width: "100%",
              marginBottom: theme.spacing.md,
            }}
          >
            <Tabs
              variant="outline"
              tabPadding="md"
              style={{
                marginTop: theme.spacing.md,
              }}
            >
              <Tabs.Tab label="Map" icon={<MapIcon size={14} />}>
                <div style={{ height: "36vh", width: "53vh" }}>
                  <Map
                    width="100%"
                    height="94%"
                    style={{ zIndex: 10 }}
                    zoom={14}
                    center={
                      data?.center?.length > 0
                        ? data?.center
                        : data?.blocks.blocks.length > 0
                        ? data?.blocks.blocks[0].area[0]
                        : undefined
                    }
                    polygon={{ data: data?.area || [] }}
                    components={data?.blocks.blocks
                      .filter((block: any) =>
                        statusFilter != null
                          ? statusFilter === 5
                            ? block.builders.includes(user.username)
                            : block.status == statusFilter
                          : true
                      )
                      .map((block: any) =>
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
                </div>
              </Tabs.Tab>
              <Tabs.Tab label="Image Gallery" icon={<Photo size={14} />}>
                {data?.image.length > 0 ? (
                  <div>
                    <Image
                      width="53vh"
                      height="28vh"
                      radius="md"
                      src={data?.image[activePage - 1]}
                      alt=""
                    />
                    <Center>
                      <Pagination
                        page={activePage}
                        onChange={setPage}
                        total={data?.image.length}
                        style={{ marginTop: theme.spacing.md }}
                      />
                    </Center>
                  </div>
                ) : (
                  <Center style={{ height: "28vh", width: "100%" }}>
                    No Images found!
                  </Center>
                )}
              </Tabs.Tab>
              <Tabs.Tab label="Statuses" icon={<ChartBar size={14} />}>
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
                        display: true,
                        position: "bottom",
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
              </Tabs.Tab>
              <Tabs.Tab label="Builders" icon={<Users size={14} />}>
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
                          .slice(0, 7)
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
              </Tabs.Tab>
            </Tabs>
          </Paper>
          <Paper
            withBorder
            radius="md"
            p="xs"
            style={{
              height: "48%",
              marginBottom: theme.spacing.md,
            }}
          >
            {(user.permission || 0) >= Permissions.Builder ? (
              <Tabs
                variant="outline"
                tabPadding="md"
                style={{ marginTop: theme.spacing.md }}
              >
                <Tabs.Tab label="Update Block" icon={<Edit size={14} />}>
                  <form onSubmit={handleSubmit}>
                    <NumberInput
                      label="Block"
                      min={1}
                      max={data?.blocks.blocks.length}
                      icon={<Hash size={18} />}
                      value={selBlock?.id}
                      onChange={handleClick}
                    />
                    <MultiSelect
                      dropdownPosition="top"
                      label="Builders"
                      searchable
                      nothingFound="No builder found"
                      placeholder="Select Builders"
                      maxDropdownHeight={190}
                      icon={<Users size={18} />}
                      data={[
                        {
                          value: user?.username ? user.username : "",
                          label: user?.username,
                          group: "You",
                        },
                      ].concat(
                        adminsettings?.value.map((s: any) => ({
                          value: s,
                          label: s,
                          group: "Special",
                        })),
                        users
                          ?.filter(
                            (u: any) =>
                              u.username !== "root" &&
                              u.username !== user?.username
                          )
                          .map((u: any) => ({
                            value: u.username,
                            label: u.username,
                            group: "Other Users",
                          }))
                      )}
                      value={selBlock?.builders}
                      onChange={(e: any) => {
                        setSelBlock({
                          ...selBlock,
                          builders: e,
                        });
                      }}
                      onCreate={(e: any) => {
                        setSelBlock({
                          ...selBlock,
                          builders: [...selBlock.builders, e],
                        });
                      }}
                    />
                    <NumberInput
                      label="Progress"
                      min={0}
                      max={100}
                      icon={<Backhoe size={18} />}
                      value={selBlock?.progress}
                      onChange={(e: any) => {
                        setSelBlock({
                          ...selBlock,
                          progress: e,
                        });
                      }}
                    />
                    <Checkbox
                      label="Street Details"
                      disabled={selBlock?.progress != 100}
                      style={{
                        marginTop: theme.spacing.md,
                        marginBottom: theme.spacing.md,
                      }}
                      value={selBlock?.details}
                      onChange={(e: any) => {
                        setSelBlock({
                          ...selBlock,
                          details: e.currentTarget.checked,
                        });
                      }}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      style={{ marginTop: theme.spacing.md }}
                    >
                      Update Block
                    </Button>
                  </form>
                </Tabs.Tab>
                {(user.permission || 0) >= Permissions.Moderator ? (
                  <Tabs.Tab label="Add Image" icon={<CameraPlus size={14} />}>
                    <form onSubmit={imageForm.onSubmit(handleAddImage)}>
                      <TextInput
                        label="Image Link"
                        name="link"
                        placeholder="https://..."
                        required
                        style={{ marginBottom: theme.spacing.md }}
                        {...imageForm.getInputProps("image")}
                      />
                      <Button type="submit" size="sm" mt="xs" mb="xs" fullWidth>
                        Add Image
                      </Button>
                    </form>
                  </Tabs.Tab>
                ) : null}
              </Tabs>
            ) : null}
          </Paper>
        </Grid.Col>
      </Grid>
    </Page>
  );
};

export default DistrictPage;
