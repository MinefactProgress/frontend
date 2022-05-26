import {
  ArrowDownRight,
  ArrowUpRight,
  Coin,
  Discount2,
  Receipt2,
  UserPlus,
} from "tabler-icons-react";
import {
  Group,
  Paper,
  SimpleGrid,
  Text,
  UseStylesOptions,
  createStyles,
} from "@mantine/core";

import React from "react";

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xl * 1.5,
  },

  value: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1,
  },

  diff: {
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  title: {
    fontWeight: 700,
    textTransform: "uppercase",
  },
}));

interface StatsGridProps {
  title: string;
  icon?: any;
  children: React.ReactNode;
  diff?: number;
  subtitle?: string;
  style?: any;
  showIcon?: boolean;
  onClick?: () => void;
}

const StatsText = (stat: StatsGridProps) => {
  const { classes } = useStyles();
  const DiffIcon =
    stat.icon || (stat.diff || 0 > 0 ? ArrowUpRight : ArrowDownRight);

  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      key={stat.title}
      style={stat.style}
      onClick={stat.onClick}
    >
      <Group position="apart">
        <Text size="xs" color="dimmed" className={classes.title}>
          {stat.title}
        </Text>
        {stat.icon}
      </Group>

      <Group align="flex-end" spacing="xs" mt={25}>
        <Text className={classes.value} style={{ display: "inline-block" }}>
          {stat.children}
        </Text>
        {stat.diff && (
          <Text
            color={stat.diff > 0 ? "teal" : "red"}
            size="sm"
            weight={500}
            className={classes.diff}
          >
            <span>{stat.diff}%</span>
          </Text>
        )}
      </Group>

      <Text size="xs" color="dimmed" mt={6} style={{ display: "inline-block" }}>
        {stat.subtitle}
      </Text>
    </Paper>
  );
};

export default StatsText;
