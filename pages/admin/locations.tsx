import {
  Button,
  NumberInput,
  Paper,
  SimpleGrid,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";

import Map from "../../components/Map";
import Page from "../../components/Page";
import { Pin } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import useSWR from "swr";
import { useState } from "react";
import useUser from "../../utils/hooks/useUser";

const LocationsPage = () => {
  const [block, setBlock] = useState(1);
  const [loc, setLoc] = useState("");
  const theme = useMantineTheme();
  const [selected, setSelected] = useState({ uid: null, area: "[[],[]]" });
  const [user, setUser] = useUser();
  const { data } = useSWR("http://142.44.137.53:8080/api/blocks/get", {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });
  console.log(user.apikey);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    fetch(
      "http://142.44.137.53:8080/api/blocks/addLocation?key=e9299168-9a87-4a44-801b-4214449e46be",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "e9299168-9a87-4a44-801b-4214449e46be",
          district: e.target.district.value,
          blockID: block,
          location: loc,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setLoc("");
        showNotification({
          title: "Location Added",
          message: "The Location of block " + block + " has been added",
          color: "green",
          icon: <Pin />,
        });
      });
  };
  return (
    <Page>
      <Paper withBorder radius="md" p="xs" style={{ height: "20vh" }}>
        <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
          How to
        </Text>
        <Text>
          1. Enter the District you want to add block locations for. (eg: Little
          Italy)
          <br />
          2. Enter the Block ID you want to add the locations for. (eg: 1)
          <br />
          3. Enter the first location you want to add. (eg: 40.71093308501933,
          -74.00563970021507)
          <br />
          4. Click the button to add the location.
          <br />
          5. Once the location box is cleared add the next point.
          <br />
          You can click on a Block on the map and choose a edge point to add it
          to your current block.
        </Text>
      </Paper>
      <Paper
        withBorder
        radius="md"
        p="xs"
        style={{ height: "38vh", marginTop: theme.spacing.md }}
      >
        <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
          Map
        </Text>
        <SimpleGrid cols={2} spacing="md" style={{ height: "94%" }}>
          <Map
            width="100%"
            height="100%"
            polygon={{ data: data?.area || [] }}
            components={data
              ?.map((block: any) =>
                block.location != "[]"
                  ? {
                      type: "polygon",
                      positions: JSON.parse(block.area),
                      options: {
                        color: `rgba(${
                          block.progress == 0
                            ? "194, 76, 60"
                            : block.progress < 100
                            ? "216, 108, 50"
                            : "106, 186, 97"
                        })`,
                        opacity: block.uid == selected.uid ? 1 : 0.1,
                      },
                      radius: 15,
                      tooltip: "Block #" + block.id,
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
              )}
          />

          <div>
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
                  <Button
                    key={i}
                    fullWidth
                    variant="subtle"
                    color="gray"
                    onClick={() => {
                      navigator.clipboard.writeText(point.join(", "));
                      setLoc(point.join(", "));
                      showNotification({
                        message: "Coordinates Copied and Pasted",
                        color: "lime",
                      });
                    }}
                  >
                    {i + 1}. {point.join(", ")}
                    <br />
                  </Button>
                ))
              : null}
          </div>
        </SimpleGrid>
      </Paper>
      <Paper
        withBorder
        radius="md"
        p="xs"
        style={{ height: "100%", marginTop: theme.spacing.md }}
      >
        <form onSubmit={handleSubmit}>
          <TextInput label="District" name="district" />
          <TextInput
            label="Location"
            name="location"
            value={loc}
            onChange={(e: any) => {
              setLoc(e.currentTarget.value);
            }}
          />
          <NumberInput
            label="Block"
            placeholder="Block"
            name="blockID"
            value={block}
            onChange={(e: any) => {
              setBlock(parseInt(e));
            }}
          />
          <Button
            type="submit"
            style={{ marginTop: theme.spacing.md }}
            fullWidth
          >
            Add Location
          </Button>
        </form>
      </Paper>
    </Page>
  );
};
export default LocationsPage;
