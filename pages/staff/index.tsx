import {
  Accordion,
  Badge,
  Center,
  Grid,
  MediaQuery,
  Paper,
  Progress,
  ScrollArea,
  Table,
  Text,
  Title,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import {
  progressToColorName,
  statusToColorName,
  statusToName,
} from "../../util/block";

import { IconBuildingCommunity } from "@tabler/icons";
import type { NextPage } from "next";
import { Page } from "../../components/Page";
import { Permissions } from "../../util/permissions";
import { UserCard } from "../../components/user/UserCard";
import { useRouter } from "next/router";
import useSWR from "swr";

const Staff: NextPage = ({}: any) => {
  const { data: dataRaw } = useSWR("/v1/users");
  const router = useRouter();
  const theme = useMantineTheme();

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
    })
    .sort((a: any, b: any) => {
      if (a.online) {
        return b.online ? 0 : -1;
      }
      if (b.online) {
        return 1;
      }
      return 0;
    });
  return (
    <Page name="Districts" icon={<IconBuildingCommunity />}>
      <Title my="lg">BuildTheEarth New York City Staff Members</Title>
      <Grid>
        {data?.map((u: any) => (
          <Grid.Col sm={2} key={u.uid}>
            <UserCard
              id={u.uid}
              avatar={u.picture || `https://mc-heads.net/avatar/${u.username}`}
              name={u.username}
              role={u.rank || "Collaborator"}
              online={u.online}
              stats={[
                {
                  value: "34",
                  label: "Claims",
                },
              ]}
            ></UserCard>
          </Grid.Col>
        ))}
      </Grid>
    </Page>
  );
};

export default Staff;