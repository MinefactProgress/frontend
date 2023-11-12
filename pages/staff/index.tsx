import { Grid, Title, useMantineTheme } from "@mantine/core";

import { IconBuildingCommunity } from "@tabler/icons";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Page } from "../../components/Page";
import { UserCard } from "../../components/user/UserCard";
import useUser from "../../hooks/useUser";

const Staff: NextPage = ({}: any) => {
  const { data: dataRaw } = useSWR("/v1/users");

  const rankSort = [
    "Owner",
    "Administrator",
    "Moderator",
    "Developer",
    "Supporter",
    "Architect",
    "Professional",
    "Advanced",
  ];

  const data = dataRaw
    ?.filter((user: any) => user.rank !== null && rankSort.includes(user.rank))
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
          <Grid.Col span={12} xs={6} md={4} lg={3} key={u.uid}>
            <UserCard
              id={u.uid}
              avatar={`https://mc-heads.net/avatar/${u.username}`}
              name={u.username}
              role={u.rank || "Collaborator"}
              online={u.online}
              stats={[
                {
                  value: u.discord,
                  label: "Discord Name",
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
