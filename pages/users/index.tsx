import {
  Avatar,
  Badge,
  Button,
  Center,
  Grid,
  Group,
  Paper,
  ScrollArea,
  Text,
} from "@mantine/core";

import Page from "../../components/Page";
import { useRouter } from "next/router";
import useSWR from "swr";

const StaffPage = () => {
  const router = useRouter();
  const { data: dataRaw } = useSWR("/api/users/get");

  const rankSort = [
    "Owner",
    "Administrator",
    "Moderator",
    "Developer",
    "Supporter",
    "Architect",
  ];

  const data = dataRaw
    ?.filter((user: any) => user.rank !== null)
    .sort((a: any, b: any) => {
      const indexA = rankSort.indexOf(a.rank);
      const indexB = rankSort.indexOf(b.rank);
      return indexA !== indexB
        ? indexA - indexB
        : a.username.localeCompare(b.username);
    });

  const rankToColor = (rank: string) => {
    switch (rank) {
      case "Owner":
        return "#AA0000";
      case "Administrator":
        return "#FF5555";
      case "Moderator":
        return "#00AAAA";
      case "Developer":
        return "#55FFFF";
      case "Supporter":
        return "#5555FF";
      case "Builder":
        return "#0000AA";
    }
  };

  const openProfile = (username: string) => {
    router.push("/users/" + username);
  };

  return (
    <Page title="Staff List">
      <Grid>
        <Group>
          {data?.map((user: any, i:number) => (
            <Paper withBorder radius="md" p="lg" key={i}>
              <Avatar
                src={"https://mc-heads.net/avatar/" + user.username}
                size={120}
                radius={120}
                mx="auto"
              />
              <Text align="center" size="lg" weight={500} mt="md">
                {user.username}
              </Text>
              <Center>
                <Badge
                  style={{
                    backgroundColor: rankToColor(user.rank),
                    color: "#FFFFFF",
                    opacity: 1,
                  }}
                >
                  {user.rank}
                </Badge>
              </Center>
              <Button
                variant="default"
                fullWidth
                mt="md"
                onClick={() => openProfile(user.username)}
              >
                View Profile
              </Button>
            </Paper>
          ))}
        </Group>
      </Grid>
    </Page>
  );
};

export default StaffPage;
