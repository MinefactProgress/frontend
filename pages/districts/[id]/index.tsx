import {
  ActionIcon,
  Badge,
  Center,
  Checkbox,
  Grid,
  Group,
  Image,
  Menu,
  Pagination,
  Paper,
  Progress,
  ScrollArea,
  Table,
  Tabs,
  Text,
  Tooltip,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import {
  IconBuildingBank,
  IconBuildingSkyscraper,
  IconChartBar,
  IconDotsVertical,
  IconEdit,
  IconLink,
  IconMap,
  IconMapPin,
  IconPhoto,
  IconUsers,
} from "@tabler/icons";
import {
  progressToColorName,
  statusToColorName,
  statusToName,
} from "../../../util/block";

import { NextPage } from "next";
import { Page } from "../../../components/Page";
import { Permissions } from "../../../util/permissions";
import { ProgressCard } from "../../../components/Stats";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useState } from "react";
import useUser from "../../../hooks/useUser";

const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",
    zIndex: 2,
    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));
const District: NextPage = ({}: any) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const [user] = useUser();
  const { classes, cx } = useStyles();
  const { data } = useSWR(`/v1/districts/${router.query.id}`);
  const [galleryActivePage, setGalleryActivePage] = useState(1);
  return (
    <Page name="District" icon={<IconBuildingBank />}>
      <Grid style={{ height: "100%" }} columns={19}>
        <Grid.Col span={9}>
          <Grid style={{ height: "100%" }}>
            <Grid.Col>
              <ProgressCard
                title={data?.name}
                max={data?.blocks.total}
                value={data?.blocks.done}
                descriptor=" Blocks finished"
              />
            </Grid.Col>
            <Grid.Col style={{ height: "100%" }}>
              <Paper withBorder radius="md" p="xs" style={{ height: "86%" }}>
                <Text
                  color="dimmed"
                  size="xs"
                  transform="uppercase"
                  weight={700}
                >
                  District Information
                </Text>
                <Tabs defaultValue="gallery" mt="md">
                  <Tabs.List>
                    <Tabs.Tab value="map" icon={<IconMap size={14} />}>
                      Map
                    </Tabs.Tab>
                    <Tabs.Tab value="gallery" icon={<IconPhoto size={14} />}>
                      Image Gallery
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="statuses"
                      icon={<IconChartBar size={14} />}
                    >
                      Statuses
                    </Tabs.Tab>
                    <Tabs.Tab value="builders" icon={<IconUsers size={14} />}>
                      Builders
                    </Tabs.Tab>
                  </Tabs.List>
                  <Tabs.Panel value="gallery" pt="md">
                    {data?.image?.length > 0 ? (
                      <div>
                        <Image
                          width="100%"
                          height="64vh"
                          radius="md"
                          fit="contain"
                          src={data?.image[galleryActivePage - 1]}
                          alt=""
                        />
                        <Center>
                          <Pagination
                            page={galleryActivePage}
                            onChange={setGalleryActivePage}
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
                  </Tabs.Panel>
                </Tabs>
              </Paper>
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col span={10}>
          <Paper
            withBorder
            radius="md"
            p="xs"
            style={{
              marginBottom: theme.spacing.md,
              height: "100%",
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
            </div>
            <ScrollArea style={{ height: "89vh" }}>
              <Table highlightOnHover>
                <thead className={classes.header}>
                  <tr>
                    <th></th>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Details</th>
                    <th>Builder</th>
                    <th>Completion Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    ? data?.blocks?.blocks.map((block: any, i: number) => (
                        <tr key={i}>
                          <td>
                            <Group>
                              <Menu>
                                <Menu.Target>
                                  <ActionIcon>
                                    <IconDotsVertical />
                                  </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown>
                                  {(user?.permission || 0) >=
                                    Permissions.builder && (
                                    <Menu.Item icon={<IconEdit size={14} />}>
                                      Edit Block
                                    </Menu.Item>
                                  )}
                                  <Menu.Item icon={<IconMapPin size={14} />}>
                                    Copy Coordinates
                                  </Menu.Item>
                                  <Menu.Item icon={<IconLink size={14} />}>
                                    Copy Link
                                  </Menu.Item>
                                </Menu.Dropdown>
                              </Menu>
                            </Group>
                          </td>
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
                                        <IconBuildingSkyscraper
                                          size={20}
                                          color={
                                            landmark.completed
                                              ? theme.colors.green[7]
                                              : landmark.builder.length > 0
                                              ? theme.colors.orange[7]
                                              : theme.colors.red[7]
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
                            <Center>
                              {Math.round(block.progress * 100) / 100 + " %"}
                            </Center>
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
                          <td>
                            {block.builders.length > 4
                              ? block.builders.slice(0, 4).join(", ") +
                                " +" +
                                (block.builders.length - 4) +
                                " more"
                              : block.builders.join(", ")}
                          </td>
                          <td>
                            {!block.completionDate
                              ? "---"
                              : new Date(
                                  block.completionDate
                                ).toLocaleDateString()}
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

export default District;
