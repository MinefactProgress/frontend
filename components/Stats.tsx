import {
  Card,
  Center,
  Group,
  Paper,
  Progress,
  RingProgress,
  Skeleton,
  Text,
  Tooltip,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import {
  IconArrowDown,
  IconArrowDownRight,
  IconArrowUp,
  IconArrowUpRight,
} from "@tabler/icons";

interface IStatsRing {
  label: string;
  stats: string;
  progress: number;
  color: string;
  icon?: any;
  height?: number;
}

const icons = {
  up: IconArrowUpRight,
  down: IconArrowDownRight,
};
const useStylesGroup = createStyles((theme) => ({
  root: {
    display: "flex",
    backgroundImage: `linear-gradient(-60deg, ${
      theme.colors[theme.primaryColor][4]
    } 0%, ${theme.colors[theme.primaryColor][7]} 100%)`,
    padding: theme.spacing.xl * 1.5,
    borderRadius: theme.radius.md,

    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column",
    },
  },

  title: {
    color: theme.white,
    textTransform: "uppercase",
    fontWeight: 700,
    fontSize: theme.fontSizes.sm,
  },

  count: {
    color: theme.white,
    fontSize: 32,
    lineHeight: 1,
    fontWeight: 700,
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  description: {
    color: theme.colors[theme.primaryColor][0],
    fontSize: theme.fontSizes.sm,
    marginTop: 5,
  },

  stat: {
    flex: 1,

    "& + &": {
      paddingLeft: theme.spacing.xl,
      marginLeft: theme.spacing.xl,
      borderLeft: `1px solid ${theme.colors[theme.primaryColor][3]}`,

      [theme.fn.smallerThan("sm")]: {
        paddingLeft: 0,
        marginLeft: 0,
        borderLeft: 0,
        paddingTop: theme.spacing.xl,
        marginTop: theme.spacing.xl,
        borderTop: `1px solid ${theme.colors[theme.primaryColor][3]}`,
      },
    },
  },
}));

interface IStatsGroup {
  data: { title?: string; stats?: string; description?: string }[];
}

export function StatsGroup({ data }: IStatsGroup) {
  const { classes } = useStylesGroup();
  const stats = data.map((stat) => (
    <div key={stat.title} className={classes.stat}>
      <Text className={classes.count}>{stat.stats || 0}</Text>
      <Text className={classes.title}>
        {stat.title || <Skeleton>1</Skeleton>}
      </Text>
      <Text className={classes.description}>
        {stat.description || <Skeleton>1</Skeleton>}
      </Text>
    </div>
  ));

  return <div className={classes.root}>{stats}</div>;
}

export function StatsRing(stat: IStatsRing) {
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

const useStylesText = createStyles((theme) => ({
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

interface IStatsGrid {
  title: string;
  icon?: any;
  children?: React.ReactNode;
  diff?: any;
  subtitle?: string;
  style?: any;
  showIcon?: boolean;
  tooltip?: string;
  onClick?: () => void;
}

export const StatsText = (stat: IStatsGrid) => {
  const { classes } = useStylesText();
  const theme = useMantineTheme();
  const DiffIcon = stat.diff || 0 > 0 ? icons.up : icons.down;
  const Icon = stat.icon;

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
        <Icon
          style={{
            color:
              theme.colorScheme === "dark"
                ? theme.colors.dark[3]
                : theme.colors.gray[4],
          }}
        />
      </Group>

      <Group align="flex-end" spacing="xs" mt={25}>
        <Tooltip label={stat.tooltip}>
          <Text className={classes.value} style={{ display: "inline-block" }}>
            {stat.children}
          </Text>
        </Tooltip>
        {stat.diff && (
          <Text
            color={stat.diff > 0 ? "teal" : "red"}
            size="sm"
            weight={500}
            className={classes.diff}
          >
            <span>{stat.diff}%</span>
            <DiffIcon />
          </Text>
        )}
      </Group>
      <Text size="xs" color="dimmed" mt={6} style={{ display: "inline-block" }}>
        {stat.subtitle}
      </Text>
    </Paper>
  );
};

const useStylesProgress = createStyles((theme) => ({
  card: {
    backgroundColor: theme.fn.primaryColor(),
  },

  title: {
    color: theme.fn.rgba(theme.white, 0.65),
  },

  stats: {
    color: theme.white,
  },

  progressBar: {
    backgroundColor: theme.white,
  },

  progressTrack: {
    backgroundColor: theme.fn.rgba(theme.white, 0.4),
  },
}));
interface IProgressCard {
  title?: string;
  max?: number;
  maxDisplay?: string;
  value?: number;
  valueDisplay?: string;
  descriptor?: string;
  style?: any
}

export function ProgressCard({
  title,
  max,
  value,
  descriptor,
  maxDisplay,
  valueDisplay,
  style
}: IProgressCard) {
  const { classes } = useStylesProgress();
  return (
    <Card withBorder radius="md" p="xl" className={classes.card} style={style}>
      <Text
        size="xs"
        transform="uppercase"
        weight={700}
        className={classes.title}
      >
        {title || "Loading..."}
      </Text>
      <Text size="lg" weight={500} className={classes.stats}>
        {valueDisplay || value || 0} / {maxDisplay || max || 100} {descriptor}
      </Text>
      <Progress
        value={((value || 0) / (max || 100)) * 100}
        mt="md"
        size="lg"
        radius="xl"
        classNames={{
          root: classes.progressTrack,
          bar: classes.progressBar,
        }}
      />
    </Card>
  );
}
