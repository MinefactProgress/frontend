import {
  ActionIcon,
  Button,
  Group,
  MediaQuery,
  NumberInput,
  Paper,
  Progress,
  ScrollArea,
  Select,
  SimpleGrid,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { Pin, Trash } from "tabler-icons-react";
import useSWR, { mutate } from "swr";

import Map from "../../components/Map";
import Page from "../../components/Page";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import useUser from "../../utils/hooks/useUser";

const LocationsPage = () => {
  const [block, setBlock] = useState(0);
  const [district, setDistrict] = useState(0);
  const [loc, setLoc] = useState("");
  const theme = useMantineTheme();
  const [selected, setSelected] = useState({
    uid: null,
    area: "[[],[]]",
    id: null,
    district:null
  });
  const [user, setUser] = useUser();
  const { data } = useSWR("/api/blocks/get", {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });
  const { data: districts } = useSWR("/api/districts/get");
  var doneElem = 0;
  var totalElem = 0;
  for (var i = 0; i < data?.length; i++) {
    const elem = data[i];
    totalElem++;
    if (elem.area != "[]") {
      doneElem++;
    }
  }

  const progress = (doneElem / totalElem) * 100;
  const handleSubmit = (e: any) => {
    if (block === 0) {
      handleDistrict(e);
    } else {
      handleBlock(e);
    }
  };
  const handleBlock = (e: any) => {
    e.preventDefault();
    fetch(
      process.env.NEXT_PUBLIC_API_URL +
        "/api/blocks/addLocation?key=e9299168-9a87-4a44-801b-4214449e46be",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "e9299168-9a87-4a44-801b-4214449e46be",
          district: district,
          blockID: block,
          location: loc,
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
          setLoc("");
          showNotification({
            title: "Location Added",
            message: "The Location of block " + block + " has been added",
            color: "green",
            icon: <Pin />,
          });
        }
      });
  };
  const handleDelete = (e: any, i: number) => {
    e.preventDefault();
    fetch(
      process.env.NEXT_PUBLIC_API_URL +
        "/api/blocks/removeLocation?key=e9299168-9a87-4a44-801b-4214449e46be",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "e9299168-9a87-4a44-801b-4214449e46be",
          uid: selected.uid,
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
          setLoc("");
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
        }
      });
  };
  const handleDistrict = (e: any) => {
    e.preventDefault();
    fetch(
      process.env.NEXT_PUBLIC_API_URL +
        "/api/districts/edit?key=e9299168-9a87-4a44-801b-4214449e46be",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "e9299168-9a87-4a44-801b-4214449e46be",
          district: district,
          areaadd: loc,
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
          setLoc("");
          showNotification({
            title: "Location Added",
            message: "The Location of Distrct " + district + " has been added",
            color: "green",
            icon: <Pin />,
          });
        }
      });
  };
  return (
    <Page>
      <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
        <Paper withBorder radius="md" p="xs" style={{ height: "8vh" }}>
          <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
            Progress of adding Locations
          </Text>
          <Progress
            value={progress}
            color={progress < 50 ? "red" : progress < 100 ? "orange" : "green"}
          />
          <Text>
            {doneElem}/{totalElem} ({Math.floor(progress * 10) / 10}%)
          </Text>
        </Paper>
      </MediaQuery>
      <MediaQuery largerThan={"sm"} styles={{ display: "none" }}>
        <Paper withBorder radius="md" p="xs">
          <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
            Progress of adding Locations
          </Text>
          <Progress
            value={progress}
            color={progress < 50 ? "red" : progress < 100 ? "orange" : "green"}
          />
          <Text>
            {doneElem}/{totalElem} ({Math.floor(progress * 10) / 10}%)
          </Text>
        </Paper>
      </MediaQuery>
      <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
        <Paper
          withBorder
          radius="md"
          p="xs"
          style={{ height: "20vh", marginTop: theme.spacing.md }}
        >
          <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
            How to
          </Text>
          <Text>
            1. Enter the District you want to add block locations for. (eg:
            Little Italy)
            <br />
            2. Enter the Block ID you want to add the locations for. (eg: 1)
            <br />
            3. Enter the first location you want to add. (eg: 40.71093308501933,
            -74.00563970021507) Or click the position on the map
            <br />
            4. Click the button to add the location.
            <br />
            5. Once the location box is cleared add the next point.
            <br />
            You can click on a Block on the map and choose a edge point to add
            it to your current block.
          </Text>
        </Paper>
      </MediaQuery>

      <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
        <Paper
          withBorder
          radius="md"
          p="xs"
          style={{ height: "35vh", marginTop: theme.spacing.md }}
        >
          <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
            Map
          </Text>
          <SimpleGrid cols={2} spacing="md" style={{ height: "94%" }}>
            <Map
              width="100%"
              height="100%"
              polygon={{ data: data?.area || [] }}
              mapEvents={{
                click: (e: any) => {
                  console.log(e.latlng);
                  setLoc(e.latlng?.lat + ", " + e.latlng?.lng);
                },
              }}
              components={data
                ?.map((block: any) =>
                  block.location != "[]" &&
                  (district ? block.district == district : true)
                    ? {
                        type: "polygon",
                        positions: JSON.parse(block.area),
                        options: {
                          color: `rgba(${
                            progress == 0
                              ? "194, 76, 60"
                              : progress < 100
                              ? "216, 108, 50"
                              : "106, 186, 97"
                          })`,
                          opacity: block.uid == selected.uid ? 1 : 0.1,
                        },
                        radius: 15,
                        tooltip: `${
                          districts?.find((d: any) => d.id === block.district)
                            .name
                        } #${block.id} (#${block.uid})`,
                        eventHandlers: {
                          click: () => {
                            setSelected(block);
                          },
                        },
                      }
                    : null
                )
                .concat(
                  selected.uid != null
                    ? JSON.parse(selected.area).map((block: any, i: number) =>
                        block
                          ? {
                              type: "marker",
                              position: block,
                              tooltip: "Point " + (i + 1),
                            }
                          : null
                      )
                    : null
                )
                .concat(
                  districts?.map((district: any) =>
                    district.location != [] && district.id >1
                      ? {
                          type: "polygon",
                          positions: district.area,
                          options: {
                            color: `blue`,
                            opacity: district.id == selected.district ? 1 : 0.1,
                          },
                          radius: 15,
                          tooltip: `${district.name}`,
                          eventHandlers: {
                            click: () => {
                              setDistrict(district.id)
                            },
                          },
                        }
                      : null
                  )
                )
                .concat({
                  type: "marker",
                  position: loc ? loc.split(", ") : [0, 0],
                  tooltip: "Added Point",
                })}
            />

            <ScrollArea>
              <Text
                color="dimmed"
                size="xs"
                transform="uppercase"
                weight={700}
                style={{ marginBottom: theme.spacing.md }}
              >
                Coordinates for Block {selected?.uid}
              </Text>
              {selected
                ? JSON.parse(selected?.area).map((point: any, i: number) => (
                    <SimpleGrid key={i} cols={2}>
                      <Text
                        color="gray"
                        onClick={() => {
                          setLoc(point.join(", "));
                          showNotification({
                            message: "Coordinates Copied and Pasted",
                            color: "lime",
                          });
                        }}
                      >
                        {i + 1}. {point.join(", ")}
                      </Text>
                      <ActionIcon onClick={(e: any) => handleDelete(e, i)}>
                        <Trash color={theme.colors.red[7]} />
                      </ActionIcon>
                    </SimpleGrid>
                  ))
                : null}
            </ScrollArea>
          </SimpleGrid>
        </Paper>
      </MediaQuery>
      <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
        <Paper
          withBorder
          radius="md"
          p="xs"
          style={{ marginTop: theme.spacing.md }}
        >
          <form onSubmit={handleSubmit}>
            <Group position="center" grow>
              <Select
                label="District"
                name="district"
                searchable
                clearable
                dropdownPosition="bottom"
                maxDropdownHeight={120}
                data={
                  districts
                    ? districts
                        ?.filter(
                          (district: any) =>
                            !districts.some(
                              (d: any) => d.parent === district.id
                            )
                        )
                        .sort((a: any, b: any) => a.name.localeCompare(b.name))
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
                onChange={(e: any) => {
                  setBlock(parseInt(e));
                  mutate("/api/blocks/get");
                }}
              />
            </Group>
            <TextInput
              label="Location"
              name="location"
              value={loc}
              onChange={(e: any) => {
                setLoc(e.currentTarget.value);
              }}
            />
            <Group grow>
              <Button type="submit" style={{ marginTop: theme.spacing.md }}>
                Add Block Location
              </Button>
              <Button
                type="submit"
                style={{ marginTop: theme.spacing.md }}
                variant="outline"
              >
                Add District Location
              </Button>
            </Group>
          </form>
        </Paper>
      </MediaQuery>
    </Page>
  );
};
export default LocationsPage;
