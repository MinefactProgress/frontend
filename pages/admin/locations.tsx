import {
    Button,
    NumberInput,
    Paper,
    Text,
    TextInput,
    useMantineTheme
} from "@mantine/core";

import Map from "../../components/Map";
import Page from "../../components/Page";
import useSWR from "swr";
import { useState } from "react";
import useUser from "../../utils/hooks/useUser";

const LocationsPage = () => {
  const [block, setBlock] = useState(1);
  const theme = useMantineTheme();

  const [user, setUser] = useUser();
  const { data } = useSWR("http://142.44.137.53:8080/api/blocks/get");
  console.log(user.apikey);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    fetch(
      "http://142.44.137.53:8080/api/blocks/setLocation?key=e9299168-9a87-4a44-801b-4214449e46be",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "e9299168-9a87-4a44-801b-4214449e46be",
          district: e.target.district.value,
          blockID: block,
          location: e.target.location.value,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setBlock(block + 1);
        e.target.location.value = "";
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
          2. Enter the Block ID you want to add the first location for. (eg: 1)
          <br />
          3. Enter the location you want to add. (eg: 40.71093308501933,
          -74.00563970021507)
          <br />
          4. Click the button to add the location.
          <br />
          5. The Block ID will automatically increment by 1.
          <br />
          6. Repeat steps 3-5 until you have added all the locations for the
          district.
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
        <Map
          width="100%"
          height="94%"
          polygon={{ data: data?.area || [] }}
          components={data?.map((block: any) =>
            block.location != "[]"
              ? {
                  type: "circle",
                  center: JSON.parse(block.location),
                  options: {
                    color: `rgba(${
                      block.progress == 0
                        ? "194, 76, 60"
                        : block.progress < 100
                        ? "216, 108, 50"
                        : "106, 186, 97"
                    })`,
                    opacity: 1,
                  },
                  radius: 15,
                  tooltip: "Block #" + block.id,
                }
              : null
          )}
        ></Map>
      </Paper>

      <Paper
        withBorder
        radius="md"
        p="xs"
        style={{ height: "100%", marginTop: theme.spacing.md }}
      >
        <form onSubmit={handleSubmit}>
          <TextInput label="District" name="district" />
          <TextInput label="Location" name="location" />
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
