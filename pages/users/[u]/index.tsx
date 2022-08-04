import {
  Armchair,
  Backhoe,
  BrandDiscord,
  BuildingSkyscraper,
  News,
} from "tabler-icons-react";
import {
  Avatar,
  Button,
  Center,
  Grid,
  Group,
  MediaQuery,
  Paper,
  ScrollArea,
  Stack,
  Table,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";

import Map from "../../../components/Map";
import Page from "../../../components/Page";
import { StatsRing } from "../../../components/StatsRing";
import { colorFromStatus } from "../../../utils/blockUtils";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useState } from "react";
import useUser from "../../../utils/hooks/useUser";

const UserPage = () => {
  const router = useRouter();
  const theme = useMantineTheme();
  const [selectedBlock, setSelectedBlock] = useState({
    block: {
      uid: 0,
      id: 0,
      district: -1,
      status: -1,
      progress: 0,
      details: false,
      builder: "",
      completionDate: null,
      area: "[]",
    },
    district: "",
  });
  const { u } = router.query;
  const [user] = useUser();
  const { data } = useSWR(`/api/users/get/${u}`);
  const { data: claims } = useSWR(`/api/claims/${u}`);
  const { data: rndImage } = useSWR(`/api/admin/getRandomImage`);
  var image = data?.image;
  if (!image) {
    image = rndImage?.link;
  }
  var districts: any | null = null;
  var builders: any | null = null;
  var claimsPolygons: any[] | null = null;
  claims?.claims.districts.sort(function (a: any, b: any) {
    return b.blocks.length - a.blocks.length;
  });
  if (claims && !claimsPolygons && !builders && !districts) {
    claimsPolygons = [];
    builders = {};
    districts = {};
    claims?.claims.districts.map((district: any) => {
      district.blocks?.map((block: any) => {
        // @ts-ignore
        claimsPolygons.push({
          type: "polygon",
          positions: block.area,
          options: {
            color: `${colorFromStatus(block.status, false)}FF`,
            opacity:
              selectedBlock.block.uid != 0
                ? block.uid == selectedBlock.block.uid
                  ? 1
                  : 0.05
                : 0.5,
          },
          radius: 15,
          tooltip:
            district.name +
            " #" +
            block.id +
            " | " +
            (block.status == 1 ? block.builders : block.progress + "%"),
          eventHandlers: {
            click: () => {
              setSelectedBlock({ block: block, district: district.name });
            },
          },
        });
        if (block.builders) {
          block.builders.map((builder: any) => {
            if (builder != u) {
              if (builders[builder]) {
                builders[builder].push(block.id);
              } else {
                builders[builder] = [block.id];
              }
            }
          });
        }
        if (districts[district.name]) {
          districts[district.name]++;
        } else {
          districts[district.name] = 1;
        }
      });
    });
  }
  if (claims && !builders) {
    claims?.claims.districts.map((district: any) => {
      district.blocks?.map((block: any) => {});
    });
  }
  if (data?.error) {
    return (
      <Page>
        <Center style={{ width: "100%", height: "90%" }}>
          <div style={{ textAlign: "center" }}>
            <Title>{data?.message}</Title>
            <Button
              variant="outline"
              style={{ marginTop: theme.spacing.md }}
              onClick={() => router.push("/users")}
            >
              Back to Staff Overview
            </Button>
          </div>
        </Center>
      </Page>
    );
  }
  return (
    <Page
      noMargin
      style={{ position: "relative" }}
      title={u?.toString()}
      noFooter
    >
      <div
        style={{
          backgroundColor: "white",
          background: `url(${image}) center center / cover`,
          width: "100%",
          height: "40vh",
        }}
      ></div>
      <Center
        style={{
          width: "100%",
          height: "40vh",
          position: "absolute",
          top: 0,
          left: 0,
          background: "rgba(0,0,0,0.7)",
        }}
      >
        <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
          <Avatar size={theme.spacing.xl * 6} src={data?.picture} radius={2000}>
            {(u || [""]).toString().charAt(0)}
          </Avatar>
        </MediaQuery>
        <Stack
          align="flex-start"
          spacing={theme.spacing.xs / 4}
          style={{
            marginLeft: theme.spacing.xl,
          }}
        >
          <Title
            style={{
              color: "white",
              fontSize: theme.fontSizes.xl * 3,
              userSelect: "text",
            }}
          >
            {data?.username || u}
          </Title>
          <Group>
            <BrandDiscord />
            <Text>{data?.discord}</Text>
          </Group>
        </Stack>
      </Center>
      <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
        <Grid style={{ height: "54vh", width: "100%", overflow: "hidden" }}>
          <Grid.Col sm={6}>
            <div>
              <Group
                style={{
                  position: "absolute",
                  zIndex: 2,
                  bottom: theme.spacing.md,
                  left: theme.spacing.md,
                }}
                position="center"
              >
                {selectedBlock.block.uid != 0 && (
                  <Button
                    variant="filled"
                    color="gray"
                    radius="xl"
                    size="md"
                    onClick={() => {
                      router.push(
                        "/districts/" +
                          selectedBlock.district +
                          "/" +
                          selectedBlock.block.id
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
                height="53vh"
                defaultLayerName="Blocks"
                zoom={13}
                mapStyle={{ zIndex: 0 }}
                components={claimsPolygons}
              ></Map>
            </div>
          </Grid.Col>
          <Grid.Col sm={6} style={{ height: "100%" }}>
            <ScrollArea style={{ width: "100%", height: "100%" }}>
              <div style={{ margin: theme.spacing.md }} id="i">
                <Grid>
                  <Grid.Col span={6}>
                    <StatsRing
                      label="Reserved"
                      stats={
                        claims?.claims.reserved + "/" + claims?.claims.total
                      }
                      progress={
                        (claims?.claims.reserved / claims?.claims.total) * 100
                      }
                      icon={<News />}
                      color={colorFromStatus(1, false)}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <StatsRing
                      label="Building"
                      stats={
                        claims?.claims.building + "/" + claims?.claims.total
                      }
                      progress={
                        (claims?.claims.building / claims?.claims.total) * 100
                      }
                      icon={<Backhoe />}
                      color={colorFromStatus(2, false)}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <StatsRing
                      label="Detailing"
                      stats={
                        claims?.claims.detailing + "/" + claims?.claims.total
                      }
                      progress={
                        (claims?.claims.detailing / claims?.claims.total) * 100
                      }
                      icon={<Armchair />}
                      color={colorFromStatus(3, false)}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <StatsRing
                      label="Done"
                      stats={claims?.claims.done + "/" + claims?.claims.total}
                      progress={
                        (claims?.claims.done / claims?.claims.total) * 100
                      }
                      icon={<BuildingSkyscraper />}
                      color={colorFromStatus(4, false)}
                    />
                  </Grid.Col>
                  {data?.about != "" && (
                    <Grid.Col span={12}>
                      <Paper withBorder radius="md" p="xs">
                        <Text
                          color="dimmed"
                          size="xs"
                          transform="uppercase"
                          weight={700}
                        >
                          About {u}
                        </Text>
                        <p>{data?.about}</p>
                      </Paper>
                    </Grid.Col>
                  )}
                  <Grid.Col span={12}>
                    <Paper withBorder radius="md" p="xs">
                      <Text
                        color="dimmed"
                        size="xs"
                        transform="uppercase"
                        weight={700}
                      >
                        {u} worked on
                      </Text>
                      <Table>
                        <thead>
                          <tr>
                            <th>District</th>
                            <th>Block(s)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {districts &&
                            Object.keys(districts).map(
                              (district: string, i: number) => {
                                if (i < 3) {
                                  return (
                                    <tr key={district}>
                                      <td>{district}</td>
                                      <td>{districts[district]}</td>
                                    </tr>
                                  );
                                }
                              }
                            )}
                        </tbody>
                      </Table>
                    </Paper>
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Paper withBorder radius="md" p="xs">
                      <Text
                        color="dimmed"
                        size="xs"
                        transform="uppercase"
                        weight={700}
                      >
                        {u} worked together with
                      </Text>
                      <Table>
                        <thead>
                          <tr>
                            <th>Builder</th>
                            <th>Block(s)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {builders &&
                            Object.keys(builders).map((builder: string) => {
                              return (
                                <tr key={builder}>
                                  <td>{builder}</td>
                                  <td>{builders[builder].length}</td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </Table>
                    </Paper>
                  </Grid.Col>
                </Grid>
              </div>
            </ScrollArea>
          </Grid.Col>
        </Grid>
      </MediaQuery>
      <MediaQuery largerThan={"sm"} styles={{ display: "none" }}>
        <div style={{ margin: theme.spacing.md }} id="i">
          <Grid>
            <Grid.Col span={6}>
              <StatsRing
                label="Reserved"
                stats={claims?.claims.reserved + "/" + claims?.claims.total}
                progress={
                  (claims?.claims.reserved / claims?.claims.total) * 100
                }
                icon={<News />}
                color={colorFromStatus(1, false)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <StatsRing
                label="Building"
                stats={claims?.claims.building + "/" + claims?.claims.total}
                progress={
                  (claims?.claims.building / claims?.claims.total) * 100
                }
                icon={<Backhoe />}
                color={colorFromStatus(2, false)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <StatsRing
                label="Detailing"
                stats={claims?.claims.detailing + "/" + claims?.claims.total}
                progress={
                  (claims?.claims.detailing / claims?.claims.total) * 100
                }
                icon={<Armchair />}
                color={colorFromStatus(3, false)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <StatsRing
                label="Done"
                stats={claims?.claims.done + "/" + claims?.claims.total}
                progress={(claims?.claims.done / claims?.claims.total) * 100}
                icon={<BuildingSkyscraper />}
                color={colorFromStatus(4, false)}
              />
            </Grid.Col>
            {data?.about != "" && (
              <Grid.Col span={12}>
                <Paper withBorder radius="md" p="xs">
                  <Text
                    color="dimmed"
                    size="xs"
                    transform="uppercase"
                    weight={700}
                  >
                    About {u}
                  </Text>
                  <p>{data?.about}</p>
                </Paper>
              </Grid.Col>
            )}
            <Grid.Col span={12}>
              <Paper withBorder radius="md" p="xs">
                <Text
                  color="dimmed"
                  size="xs"
                  transform="uppercase"
                  weight={700}
                >
                  {u}´ most worked on Districts
                </Text>
                <Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Blocks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {districts &&
                      Object.keys(districts).map(
                        (district: string, i: number) => {
                          if (i < 3) {
                            return (
                              <tr key={district}>
                                <td>{district}</td>
                                <td>{districts[district]}</td>
                              </tr>
                            );
                          }
                        }
                      )}
                  </tbody>
                </Table>
              </Paper>
            </Grid.Col>
            <Grid.Col span={12}>
              <Paper withBorder radius="md" p="xs">
                <Text
                  color="dimmed"
                  size="xs"
                  transform="uppercase"
                  weight={700}
                >
                  {u} worked together with
                </Text>
                <Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Block</th>
                    </tr>
                  </thead>
                  <tbody>
                    {builders &&
                      Object.keys(builders).map((builder: string) => {
                        return (
                          <tr key={builder}>
                            <td>{builder}</td>
                            <td>{builders[builder].join(", ")}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </Paper>
            </Grid.Col>
          </Grid>
        </div>
      </MediaQuery>
    </Page>
  );
};

export default UserPage;
