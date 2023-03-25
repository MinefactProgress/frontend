import {
  Avatar,
  BackgroundImage,
  Box,
  Center,
  Grid,
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
    <Page name={data?.username || id} icon={<IconUsers />} noMargin>
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
      <Grid mx="md" mt="xl">
        <Grid.Col span={12}>
          <StatsGroup
            data={[
              {
                title: "Blocks",
                stats: data?.claims.total,
                description: "in total.",
              },
              {
                title: "Blocks",
                stats: data?.claims.reserved,
                description: "are reserved.",
              },
              {
                title: "Blocks",
                stats: data?.claims.building,
                description: "are under construction.",
              },
              {
                title: "Blocks",
                stats: data?.claims.detailing,
                description: "need to be detailed.",
              },
              {
                title: "Blocks",
                stats: data?.claims.done,
                description: "are done",
              },
            ]}
          />
        </Grid.Col>
      </Grid>
    </Page>
  );
};

export function getServerSideProps(context: any) {
  return { props: { id: context.params.id } };
}
export default UserPage;
