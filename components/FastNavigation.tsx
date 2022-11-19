import {
  Anchor,
  Card,
  Group,
  SimpleGrid,
  Text,
  UnstyledButton,
  createStyles,
} from "@mantine/core";
import {
  IconBuildingBank,
  IconBuildingCommunity,
  IconBuildingMonument,
  IconCashBanknote,
  IconCoin,
  IconCreditCard,
  IconHierarchy,
  IconMap,
  IconReceipt,
  IconReceiptRefund,
  IconReceiptTax,
  IconRepeat,
  IconReport,
  IconSearch,
  IconUsers,
} from "@tabler/icons";
import { Router, useRouter } from "next/router";

const data = [
  { title: "Staff Team", icon: IconUsers, color: "orange", href: "/staff" },
  {
    title: "Claim Landmarks",
    icon: IconBuildingMonument,
    color: "orange",
    href: "/landmarks",
  },
  {
    title: "District Overview",
    icon: IconBuildingCommunity,
    color: "orange",
    href: "/districts",
  },
  {
    title: "Network Status",
    icon: IconHierarchy,
    color: "orange",
    href: "/network",
  },
  {
    title: "Map",
    icon: IconMap,
    color: "orange",
    href: "/map",
  },
  {
    title: "Search",
    icon: IconSearch,
    color: "orange",
    onClick: () => {},
  },
];

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  title: {
    fontWeight: 700,
  },

  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: theme.radius.md,
    height: 90,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[1],
    transition: "box-shadow 150ms ease, transform 100ms ease",

    "&:hover": {
      boxShadow: `${theme.shadows.md} !important`,
      transform: "scale(1.05)",
    },
  },
}));

export function FastNavigation() {
  const { classes, theme } = useStyles();
  const router = useRouter();

  const items = data.map((item) => (
    <UnstyledButton
      key={item.title}
      className={classes.item}
      onClick={() => item.onClick || router.push(item.href)}
    >
      <item.icon color={theme.colors[item.color][6]} size={32} />
      <Text size="xs" mt={7}>
        {item.title}
      </Text>
    </UnstyledButton>
  ));

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Group position="apart">
        <Text className={classes.title}>Quick Links</Text>
      </Group>
      <SimpleGrid cols={3} mt="md">
        {items}
      </SimpleGrid>
    </Card>
  );
}
