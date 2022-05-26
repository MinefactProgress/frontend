import { ArrowDownRight, ArrowUpRight } from "tabler-icons-react";
import { Center, Group, Paper, RingProgress, Text } from "@mantine/core";

import React from "react";

interface StatsRingProps {
  label: string;
  stats: string;
  progress: number;
  color: string;
  icon?: any;
  height?: number;
}

const icons = {
  up: ArrowUpRight,
  down: ArrowDownRight,
};

export function StatsRing(stat: StatsRingProps) {
  return (
    <Paper withBorder radius="md" p="xs" key={stat.label}>
      <Group sx={{ height: stat.height }}>
        <RingProgress
          size={80}
          roundCaps
          thickness={8}
          sections={[{ value: stat.progress, color: stat.color }]}
          label={<Center>{stat.icon}</Center>}
        />

        <div>
          <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
            {stat.label}
          </Text>
          <Text weight={700} size="xl">
            {stat.stats}
          </Text>
        </div>
      </Group>
    </Paper>
  );
}
