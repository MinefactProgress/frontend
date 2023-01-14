import {
  Avatar,
  Button,
  Card,
  Group,
  Indicator,
  Text,
  createStyles,
} from "@mantine/core";

import { rankToColor } from "../../util/permissions";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  avatar: {
    border: `2px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white
    }`,
  },
}));

interface UserCardProps {
  avatar: string;
  name: string;
  role: string;
  id: number | string;
  online?: boolean;
  stats: { label: string; value: string }[];
}

export function UserCard({
  avatar,
  name,
  role,
  stats,
  id,
  online,
}: UserCardProps) {
  const { classes, theme } = useStyles();

  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text align="center" size="lg" weight={500}>
        {stat.value}
      </Text>
      <Text align="center" size="sm" color="dimmed">
        {stat.label}
      </Text>
    </div>
  ));

  return (
    <Card withBorder p="xl" radius="md" className={classes.card}>
      <Indicator color="green" size={16} withBorder disabled={!online}>
        <Avatar src={avatar} size={80} radius={80} mx="auto" />
      </Indicator>
      <Text align="center" size="lg" weight={500} mt="sm">
        {name}
      </Text>
      <Text
        align="center"
        size="sm"
        color="dimmed"
        style={{ color: rankToColor(role) }}
      >
        {role}
      </Text>
      <Group mt="md" position="center" spacing={30}>
        {items}
      </Group>
      <Button
        fullWidth
        radius="md"
        mt="xl"
        size="md"
        component="a"
        color={theme.colorScheme === "dark" ? undefined : "dark"}
        href={`/staff/${id}`}
      >
        Open Profile
      </Button>
    </Card>
  );
}
