import { useState } from "react";
import {
  createStyles,
  Badge,
  Grid,
  Paper,
  ScrollArea,
  Table,
  Text,
  TextInput,
  useMantineTheme,
  LoadingOverlay,
  Box,
  Group,
  ActionIcon,
  Modal,
  Select,
  Button,
  Avatar,
} from "@mantine/core";
import useSWR from "swr";
import { IconCheck, IconEdit, IconSearch, IconX } from "@tabler/icons";
import { Ranks, rankToColor } from "../../util/permissions";
import { getRecommendedTextColor } from "../../util/color";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";

const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

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
    boxShadow: theme.shadows.md,
  },
}));

export const Users = () => {
  const theme = useMantineTheme();
  const { data } = useSWR("/v1/users");
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState("");
  const [rankFilter, setRankFilter] = useState<string | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const handleRankFilterChange = (event: React.MouseEvent<HTMLElement>) => {
    if (rankFilter === event.currentTarget.children[0].innerHTML) {
      setRankFilter(null);
    } else {
      setRankFilter(event.currentTarget.children[0].innerHTML);
    }
  };

  return (
    <Grid>
      <Grid.Col xl={7}>
        <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
          <Box pos="relative">
            <LoadingOverlay visible={!data} />
            <ScrollArea
              h={750}
              onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
            >
              <TextInput
                placeholder="Search by username or discord"
                mb="md"
                icon={<IconSearch size="0.9rem" stroke={1.5} />}
                value={search}
                onChange={handleSearchChange}
              />
              <Group mb={10} position="center">
                {Ranks.map((rank) => (
                  <Group
                    key={rank}
                    mx={4}
                    spacing="xs"
                    onClick={(e) => handleRankFilterChange(e)}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <Text
                      fw={rankFilter === rank ? 900 : 700}
                      td={rankFilter === rank ? "underline" : ""}
                    >
                      {rank}
                    </Text>
                    <Badge
                      style={{
                        backgroundColor: rankToColor(rank),
                        color: getRecommendedTextColor(rankToColor(rank)),
                      }}
                    >
                      {data?.filter((user: any) => user.rank === rank).length ||
                        "..."}
                    </Badge>
                  </Group>
                ))}
              </Group>
              <Table miw={700} highlightOnHover>
                <thead
                  className={cx(classes.header, {
                    [classes.scrolled]: scrolled,
                  })}
                >
                  <tr>
                    <th>UID</th>
                    <th>User</th>
                    <th>Discord</th>
                    <th>Rank</th>
                    <th>Linked to Minecraft</th>
                    <th>Account created</th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    ?.filter(
                      (user: any) =>
                        rankFilter === null || user.rank === rankFilter
                    )
                    .filter(
                      (user: any) =>
                        user.username
                          .toLowerCase()
                          .trim()
                          .includes(search.toLowerCase().trim()) ||
                        user.discord
                          .toLowerCase()
                          .trim()
                          .includes(search.toLowerCase().trim())
                    )
                    .map((currentUser: any) => (
                      <tr key={currentUser.uid}>
                        <td>{currentUser.uid}</td>
                        <td>
                          <Group>
                            <Avatar
                              size={26}
                              src={currentUser.picture}
                              radius={26}
                            />
                            {currentUser.username}
                          </Group>
                        </td>
                        <td>{currentUser.discord}</td>
                        <td>
                          {currentUser.rank ? (
                            <Badge
                              variant="outline"
                              style={{
                                color: rankToColor(currentUser.rank),
                                borderColor: rankToColor(currentUser.rank),
                              }}
                            >
                              {currentUser.rank}
                            </Badge>
                          ) : (
                            "---"
                          )}
                        </td>
                        <td>
                          {currentUser.mc_uuid ? (
                            <IconCheck color={theme.colors.green[5]} />
                          ) : (
                            <IconX color={theme.colors.red[5]} />
                          )}
                        </td>
                        <td>
                          {new Date(currentUser.created).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </ScrollArea>
          </Box>
        </Paper>
      </Grid.Col>
      <Grid.Col xl={5} md={12}>
        <Paper withBorder radius="md" p="xs" style={{ height: "49%" }}></Paper>
        <Paper
          withBorder
          radius="md"
          p="xs"
          mt="md"
          style={{ height: "49%" }}
        ></Paper>
      </Grid.Col>
    </Grid>
  );
};
