import {
  ActionIcon,
  Center,
  Navbar as MNavbar,
  Menu,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
  createStyles,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  IconCalendarStats,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconGauge,
  IconHome2,
  IconLogout,
  IconMessage,
  IconMoonStars,
  IconSettings,
  IconSun,
  IconSwitchHorizontal,
  IconUser,
  TablerIcon,
} from "@tabler/icons";

import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  link: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },

  active: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

interface NavbarLinkProps {
  icon: TablerIcon;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles();
  if (label) {
    return (
      <Tooltip label={label} position="right" transitionDuration={0}>
        <UnstyledButton
          onClick={onClick}
          className={cx(classes.link, { [classes.active]: active })}
        >
          <Icon stroke={1.5} />
        </UnstyledButton>
      </Tooltip>
    );
  }
  return (
    <UnstyledButton
      onClick={onClick}
      className={cx(classes.link, { [classes.active]: active })}
    >
      <Icon stroke={1.5} />
    </UnstyledButton>
  );
}

export function Navbar({
  data,
}: {
  data: { icon: any; label: string; href: string }[];
}) {
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const theme = useMantineTheme();
  const links = data.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={router.pathname.toLowerCase() == link.href.toLowerCase()}
      onClick={() =>
        router.pathname.toLowerCase() != link.href.toLowerCase() &&
        router.push(link.href)
      }
    />
  ));

  return (
    <MNavbar width={{ base: 80 }} p="md">
      <Center>
        <Image src="/logo.webp" alt="logo" width={64} height={64}></Image>
      </Center>
      <MNavbar.Section grow mt={50}>
        <Stack justify="center" spacing={0}>
          {links}
        </Stack>
      </MNavbar.Section>
      <MNavbar.Section>
        <Stack justify="center" spacing={0}>
          <NavbarLink
            icon={dark ? IconSun : IconMoonStars}
            label="Toggle Theme"
            onClick={() => toggleColorScheme()}
          />
          <NavbarLink icon={IconSettings} label="Settings" />
          <NavbarLink icon={IconLogout} label="Logout" />
        </Stack>
      </MNavbar.Section>
    </MNavbar>
  );
}
