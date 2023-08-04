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
} from "@mantine/core";
import useSWR from "swr";
import { IconCheck, IconSearch, IconX } from "@tabler/icons";
import { Ranks, rankToColor } from "../../util/permissions";
import { getRecommendedTextColor } from "../../util/color";

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
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
                placeholder="Search by any field"
                mb="md"
                icon={<IconSearch size="0.9rem" stroke={1.5} />}
                value={search}
                onChange={handleSearchChange}
              />
              <Group mb={10} position="center">
                {Ranks.map((rank) => (
                  <Group mx={4} spacing="xs">
                    <Text fw={700}>{rank}</Text>
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
                    <th>Username</th>
                    <th>Discord</th>
                    <th>Rank</th>
                    <th>Linked to Minecraft</th>
                    <th>Account created</th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    ?.filter((user: any) => {
                      const values: string[] = Object.values(user).filter(
                        (val) => typeof val === "string"
                      ) as string[];
                      for (const value of values) {
                        if (
                          value
                            .toLowerCase()
                            .trim()
                            .includes(search.toLowerCase().trim())
                        ) {
                          return true;
                        }
                      }
                      return false;
                    })
                    .map((user: any) => (
                      <tr key={user.uid}>
                        <td>{user.uid}</td>
                        <td>{user.username}</td>
                        <td>{user.discord}</td>
                        <td>
                          {user.rank ? (
                            <Badge
                              variant="outline"
                              style={{
                                color: rankToColor(user.rank),
                                borderColor: rankToColor(user.rank),
                              }}
                            >
                              {user.rank}
                            </Badge>
                          ) : (
                            "---"
                          )}
                        </td>
                        <td>
                          {user.mc_uuid ? (
                            <IconCheck color={theme.colors.green[5]} />
                          ) : (
                            <IconX color={theme.colors.red[5]} />
                          )}
                        </td>
                        <td>{new Date(user.created).toLocaleString()}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </ScrollArea>
          </Box>
        </Paper>
      </Grid.Col>
    </Grid>
  );
};
