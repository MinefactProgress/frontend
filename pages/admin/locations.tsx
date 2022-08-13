import {
  Button,
  Divider,
  Group,
  MediaQuery,
  NumberInput,
  ScrollArea,
  SegmentedControl,
  Select,
  Switch,
  Text,
  TextInput,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import {
  DragDrop,
  Pin,
  PinnedOff,
  Select as TSelect,
  Trash,
} from "tabler-icons-react";
import useSWR, { mutate } from "swr";

import Map from "../../components/Map";
import MapLayer from "../../components/MapLayer";
import Page from "../../components/Page";
import { showNotification } from "@mantine/notifications";
import { useHotkeys } from "@mantine/hooks";
import { useState } from "react";
import useUser from "../../utils/hooks/useUser";

const tools = [
  { id: 3, name: "Move View", color: "orange", icon: <DragDrop size={16} /> },
  {
    id: 1,
    name: "Add Marker",
    color: "green",
    icon: <Pin size={16} />,
    right: (
      <Text size="xs" color="dimmed">
        X
      </Text>
    ),
  },
  { id: 2, name: "Delete Marker", color: "red", icon: <PinnedOff size={16} /> },
  {
    id: 4,
    name: "Select Block",
    color: "green",
    icon: <TSelect size={16} />,
    right: (
      <Text size="xs" color="dimmed">
        Y
      </Text>
    ),
  },
];

const LocationsPage = () => {
  const theme = useMantineTheme();
  const [user] = useUser();
  const { data } = useSWR("/api/blocks/get", {
    refreshInterval: 60000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });
  const { data: districts } = useSWR("/api/districts/get", {
    refreshInterval: 60000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });
  const [tool, setTool] = useState({
    id: 3,
    name: "Move View",
    color: "orange",
    icon: <DragDrop size={16} />,
  });
  const [edgeMarkers, setEdgeMarkers] = useState(true);
  const [editType, setEditType] = useState("b");
  const [location, setLocation] = useState("");
  const [block, setBlock] = useState(0);
  const [district, setDistrict] = useState(0);
  const [selectedBlock, setSelectedBlock] = useState({
    uid: null,
    area: [
      [0, 0],
      [0, 0],
    ],
    id: null,
    district: null,
  });

  const handleSubmit = (loc?: string) => {
    if (editType == "b") {
      handleBlock(loc);
    } else {
      handleDistrict(loc);
    }
  };
  const handleBlock = (loc?: string) => {
    fetch(
      process.env.NEXT_PUBLIC_API_URL +
        `/api/blocks/addLocation?key=${user.apikey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          district,
          blockID: block,
          location: loc || location,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          showNotification({
            title: "Error Adding Location",
            message: res.message,
            color: "red",
          });
        } else {
          setLocation("");
          showNotification({
            title: "Location Added",
            message: "The Location of block " + block + " has been added",
            color: "green",
            icon: <Pin />,
          });
          mutate("/api/blocks/get");
          mutate("/api/blocks/get");
        }
      });
  };
  const handleDistrict = (loc?: string) => {
    fetch(
      process.env.NEXT_PUBLIC_API_URL +
        "/api/districts/edit?key=e9299168-9a87-4a44-801b-4214449e46be",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "e9299168-9a87-4a44-801b-4214449e46be",
          district,
          areaadd: loc || location,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          showNotification({
            title: "Error Adding Location",
            message: res.message,
            color: "red",
          });
        } else {
          showNotification({
            title: "Location Added",
            message: "The Location of Distrct " + district + " has been added",
            color: "green",
            icon: <Pin />,
          });
          mutate("/api/districts/get");
        }
      });
  };
  const handleDelete = (i: number) => {
    fetch(
      process.env.NEXT_PUBLIC_API_URL +
        `/api/blocks/removeLocation?key=${user.apikey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: selectedBlock.uid,
          index: i,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          showNotification({
            title: "Error Deleting Location",
            message: res.message,
            color: "red",
            icon: <Trash />,
          });
        } else {
          setLocation("");
          showNotification({
            title: "Location Deleted",
            message:
              "The Location " +
              (i + 1) +
              " of block " +
              block +
              " has been deleted",
            color: "green",
            icon: <Pin />,
          });
          mutate("/api/blocks/get");
        }
      });
  };

  useHotkeys([
    [
      "y",
      () => {
        setTool(tools[3]);
      },
    ],
    [
      "x",
      () => {
        setTool(tools[1]);
      },
    ],
  ]);

  return (
    <Page
      noMargin
      navbar={
        <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
          <ScrollArea style={{ height: "82vh" }}>
            {tools.map((t) => (
              <UnstyledButton
                onClick={() => {
                  setTool(t);
                }}
                sx={(theme) => ({
                  display: "block",
                  width: "100%",
                  padding: theme.spacing.xs,
                  borderRadius: theme.radius.sm,
                  marginTop: theme.spacing.xs / 2,
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[0]
                      : theme.black,
                  backgroundColor:
                    t.id == tool.id
                      ? theme.colorScheme === "dark"
                        ? theme.colors.dark[5]
                        : theme.colors.gray[1]
                      : undefined,
                  "&:hover": {
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[6]
                        : theme.colors.gray[0],
                  },
                })}
                key={t.id}
              >
                <Group>
                  <ThemeIcon color={t.color} variant="light">
                    {t.icon}
                  </ThemeIcon>
                  <Text size="sm">{t.name}</Text>
                  {t.right}
                </Group>
              </UnstyledButton>
            ))}

            <Divider my="sm" size="sm" />

            {(tool.id == 1 || tool.id == 2 || tool.id == 4) && (
              <form>
                <Text
                  color="dimmed"
                  size="xs"
                  transform="uppercase"
                  weight={700}
                  style={{ marginBottom: theme.spacing.md }}
                >
                  {tool.id == 2 || tool.id == 4
                    ? "Search a block"
                    : "Block to add marker"}
                </Text>
                <Select
                  label="District"
                  name="district"
                  searchable
                  clearable
                  dropdownPosition="bottom"
                  data={
                    districts
                      ? districts
                          ?.filter(
                            (district: any) =>
                              !districts.some(
                                (d: any) => d.parent === district.id
                              )
                          )
                          .sort((a: any, b: any) =>
                            a.name.localeCompare(b.name)
                          )
                          .map((district: any) => {
                            const filter = districts?.filter(
                              (d: any) => d.name === district.name
                            );
                            if (filter.length > 1) {
                              return {
                                value: district.id,
                                label: `${district.name} (${
                                  districts?.find(
                                    (d: any) => d.id === district.parent
                                  ).name
                                })`,
                              };
                            } else {
                              return {
                                value: district.id,
                                label: district.name,
                              };
                            }
                          })
                      : []
                  }
                  onChange={(e: any) => {
                    setDistrict(e);
                  }}
                />
                <NumberInput
                  label="Block"
                  placeholder="Block"
                  name="blockID"
                  value={block}
                  min={0}
                  onChange={(e: any) => {
                    setBlock(parseInt(e));
                    mutate("/api/blocks/get");
                    if (tool.id == 2 || tool.id == 4) {
                      const found = data?.find(
                        (b: any) => b.id === block && b.district === district
                      );
                      if (found) {
                        setSelectedBlock(found);
                      }
                    }
                  }}
                />
                {tool.id == 1 && (
                  <>
                    <TextInput
                      label="Location"
                      name="location"
                      value={location}
                      onChange={(e: any) => {
                        setLocation(e.currentTarget.value);
                      }}
                    />
                    <Button
                      type="submit"
                      style={{ marginTop: theme.spacing.md }}
                    >
                      Add Block Location
                    </Button>
                  </>
                )}
              </form>
            )}

            {tool.id == 2 && (
              <>
                <Divider my="sm" size="sm" />
                <Text
                  color="dimmed"
                  size="xs"
                  transform="uppercase"
                  weight={700}
                  style={{ marginBottom: theme.spacing.md }}
                >
                  Block`s Markers
                </Text>
                {selectedBlock.uid != null
                  ? selectedBlock?.area.map((point: any, i: number) => (
                      <UnstyledButton
                        onClick={() => {
                          console.log(i);
                          handleDelete(i);
                        }}
                        sx={(theme) => ({
                          display: "block",
                          width: "100%",
                          padding: theme.spacing.xs,
                          borderRadius: theme.radius.sm,
                          marginTop: theme.spacing.xs / 2,
                          color:
                            theme.colorScheme === "dark"
                              ? theme.colors.dark[0]
                              : theme.black,
                          backgroundColor: false
                            ? theme.colorScheme === "dark"
                              ? theme.colors.dark[5]
                              : theme.colors.gray[1]
                            : undefined,
                          "&:hover": {
                            backgroundColor:
                              theme.colorScheme === "dark"
                                ? theme.colors.dark[6]
                                : theme.colors.gray[0],
                          },
                        })}
                        key={i}
                      >
                        <Text size="sm">{point.join(", ")}</Text>
                      </UnstyledButton>
                    ))
                  : null}
              </>
            )}

            <Divider my="sm" size="sm" />
            <Text
              color="dimmed"
              size="xs"
              transform="uppercase"
              weight={700}
              style={{ marginBottom: theme.spacing.md }}
            >
              Settings
            </Text>
            <SegmentedControl
              style={{ marginBottom: theme.spacing.md }}
              fullWidth
              value={editType}
              onChange={setEditType}
              data={[
                { label: "Edit Block", value: "b" },
                { label: "Edit District", value: "d" },
              ]}
            />
            <Switch
              checked={edgeMarkers}
              onChange={(event) => setEdgeMarkers(event.currentTarget.checked)}
              label="Selected Markers"
            />
          </ScrollArea>
        </MediaQuery>
      }
    >
      <div
        style={{
          width: "100%",
          height: "calc(100vh - 60px)",
          position: "relative",
        }}
      >
        <Map
          width="100%"
          height="100%"
          polygon={{ data: data?.area || [] }}
          defaultLayerName="Location Markers"
          mapEvents={{
            click: (e: any) => {
              if (tool.id == 1) {
                setLocation(e.latlng?.lat + ", " + e.latlng?.lng);
                handleSubmit(e.latlng?.lat + ", " + e.latlng?.lng);
              }
            },
          }}
          components={[]}
        >
          <MapLayer
            checked={edgeMarkers}
            name="Block Points"
            components={
              edgeMarkers
                ? selectedBlock?.area.map((point: any, i: number) =>
                    point != []
                      ? {
                          type: "marker",
                          position: point,
                          tooltip: "Point " + (i + 1),
                          eventHandlers: {
                            click: () => {
                              if (tool.id == 1) {
                                setLocation(point.join(", "));
                                handleSubmit(point.join(", "));
                              } else if (tool.id == 2) {
                                console.log(i);
                                handleDelete(i);
                              }
                            },
                          },
                        }
                      : null
                  )
                : null
            }
          />
          <MapLayer
            checked
            name="Blocks"
            components={data?.map((block: any) =>
              block.location != "[]"
                ? {
                    type: "polygon",
                    positions: block.area,
                    options: {
                      color:
                        block.uid == selectedBlock.uid
                          ? theme.colors.green[7]
                          : district
                          ? block.district == district
                            ? theme.colors.teal[7]
                            : theme.colors.blue[7]
                          : theme.colors.cyan[7],
                      opacity:
                        block.uid == selectedBlock.uid
                          ? 1
                          : district
                          ? block.district == district
                            ? 0.5
                            : 0.05
                          : 0.4,
                    },
                    radius: 15,
                    tooltip: `${
                      districts?.find((d: any) => d.id === block.district).name
                    } #${block.id} (#${block.uid})`,
                    eventHandlers: {
                      click: () => {
                        if (tool.id == 4 || tool.id == 2) {
                          setSelectedBlock(block);
                          setTool(tools[1]);
                        }
                      },
                    },
                  }
                : null
            )}
          />
          <MapLayer
            name="Districts"
            components={districts?.map((district: any) =>
              district.location != [] && district.id > 1
                ? {
                    type: "polygon",
                    positions: district.area,
                    options: {
                      color: `orange`,
                      opacity: 1,
                    },
                    radius: 15,
                    tooltip: district.name,
                  }
                : null
            )}
          />
        </Map>
      </div>
    </Page>
  );
};
export default LocationsPage;
