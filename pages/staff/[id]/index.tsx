import {
  Avatar,
  BackgroundImage,
  Box,
  Center,
  Group,
  Indicator,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconBrandDiscord, IconUsers } from "@tabler/icons";

import { Page } from "../../../components/Page";
import { StatsGroup } from "../../../components/Stats";
import useSWR from "swr";

const UserPage = ({ id }: any) => {
  const theme = useMantineTheme();
  const { data } = useSWR(`/v1/users/${id}`);
  return (
    <Page name={id} icon={<IconUsers />} noMargin>
      <BackgroundImage src={data?.image}>
        <Center
          style={{
            width: "100%",
            height: "40vh",
            background: "rgba(0,0,0,0.7)",
          }}
        >
          <Indicator color="green" size={16} disabled={!data?.online}>
            <Avatar
              size={theme.spacing.xl * 6}
              src={`https://mc-heads.net/avatar/${data?.username}`}
              radius={2000}
            >
              {(data?.username || [""]).toString().charAt(0)}
            </Avatar>
          </Indicator>
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
              {data?.username}
            </Title>
            <Group>
              <IconBrandDiscord />
              <Text>{data?.discord}</Text>
            </Group>
          </Stack>
        </Center>
      </BackgroundImage>
      <StatsGroup
        data={[
          {
            title: "Projects",
            stats: data?.projects?.[0].projects,
            description:
              data?.projects?.[0].projects -
              data?.projects?.[1].projects +
              " new Projects since yesterday.",
          },
          {
            title: "Blocks",
            stats: data?.blocks.total,
            description:
              "out of which " + data?.blocks.done + " Blocks are done.",
          },
          {
            title: "Districts",
            stats: data?.districts.count,
            description: "in " + data?.districts.boroughs + " Boroughs",
          },
        ]}
      />
    </Page>
  );
};

export function getServerSideProps(context: any) {
  return { props: { id: context.params.id } };
}
export default UserPage;
