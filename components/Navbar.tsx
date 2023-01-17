import {
  Avatar,
  Center,
  Navbar as MNavbar,
  Stack,
  Tooltip,
  UnstyledButton,
  createStyles,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconLogin, IconLogout, IconMoonStars, IconSun } from "@tabler/icons";
import useUser, { useAuth } from "../hooks/useUser";

import Image from "next/image";
import { useRouter } from "next/router";

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
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?(): void;
}

export function NavbarLink({ icon, label, active, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles();
  if (label) {
    return (
      <Tooltip label={label} position="right" transitionDuration={0}>
        <UnstyledButton
          onClick={onClick}
          className={cx(classes.link, { [classes.active]: active })}
        >
          {icon}
        </UnstyledButton>
      </Tooltip>
    );
  }
  return (
    <UnstyledButton
      onClick={onClick}
      className={cx(classes.link, { [classes.active]: active })}
    >
      {icon}
    </UnstyledButton>
  );
}

export function Navbar({
  data,
}: {
  data: {
    icon: any;
    label: string;
    href: string;
    permission?: number;
  }[];
}) {
  const router = useRouter();
  const auth = useAuth();
  const [user] = useUser();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const theme = useMantineTheme();
  const links = data.map(
    (link, index) =>
      hasPermission(link.permission || 0, user?.permission) && (
        <NavbarLink
          icon={link.icon}
          label={link.label}
          key={"l" + index}
          active={router.pathname.toLowerCase() == link.href.toLowerCase()}
          onClick={() =>
            router.pathname.toLowerCase() != link.href.toLowerCase() &&
            router.push(link.href)
          }
        />
      )
  );

  return (
    <MNavbar width={{ base: 80 }} p="md">
      <Center>
        <Image
          src="/BTE_NYC_Logo.webp"
          alt="logo"
          width={64}
          height={64}
        ></Image>
      </Center>
      <MNavbar.Section grow mt={50}>
        <Stack justify="center" spacing={0}>
          {links}
        </Stack>
      </MNavbar.Section>
      <MNavbar.Section>
        <Stack justify="center" spacing={0}>
          <NavbarLink
            icon={dark ? <IconSun /> : <IconMoonStars />}
            label="Toggle Theme"
            onClick={() => toggleColorScheme()}
          />
          {auth && (
            <NavbarLink
              icon={
                <Avatar
                  variant="filled"
                  radius="xl"
                  color="orange"
                  src={user?.picture}
                  size="sm"
                />
              }
              label="Account"
            />
          )}
          <NavbarLink
            icon={auth ? <IconLogout /> : <IconLogin />}
            label={auth ? "Logout" : "Login"}
            onClick={() => router.push("/login")}
          />
        </Stack>
      </MNavbar.Section>
    </MNavbar>
  );
}
function hasPermission(needed: number, permission?: number) {
  if (!permission) {
    if (needed != 0) return false;
    return true;
  }

  return permission >= needed;
}
