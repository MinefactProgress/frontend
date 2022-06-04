/* eslint-disable @next/next/no-img-element */

import {
  ActionIcon,
  AppShell,
  Avatar,
  Box,
  Burger,
  Center,
  Divider,
  Group,
  Header,
  Indicator,
  Loader,
  MediaQuery,
  Menu,
  Navbar,
  ScrollArea,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  ChevronLeft,
  ChevronRight,
  Confetti,
  Login,
  Logout,
  MoonStars,
  Refresh,
  Search,
  Settings,
  Sun,
  Trash,
} from "tabler-icons-react";
import { useEffect, useState } from "react";

import Head from "next/head";
import pages from "../components/routes";
import { useRouter } from "next/router";
import useUser from "../utils/hooks/useUser";

export default function Page(props: {
  children: React.ReactNode;
  scroll?: boolean;
  noMargin?: boolean;
  style?: any;
  title?: string;
}) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const router = useRouter();
  const [user, setUser] = useUser();
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  });
  if (loading) {
    return (
      <Center style={{ width: "100vw", height: "100vh" }}>
        <Loader color="dark" size="lg" />
      </Center>
    );
  }
  return (
    <AppShell
      padding={props.noMargin ? 0 : "md"}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={
        <Navbar
          width={{
            // When viewport is larger than theme.breakpoints.sm, Navbar width will be 300
            sm: 200,

            // When viewport is larger than theme.breakpoints.lg, Navbar width will be 400
            lg: 300,

            // When other breakpoints do not match base width is used, defaults to 100%
            base: 200,
          }}
          p="xs"
          fixed
          position={{ top: 0, left: 0 }}
          hiddenBreakpoint="sm"
          hidden={!opened}
        >
          <Navbar.Section grow mt="xs">
            {/* Page Navigation */}
            {pages.map((page) =>
              page.permission <= (user.permission || 0) ? (
                page.divider ? (
                  <Divider my="sm" size="sm" label={page.label} />
                ) : (
                  <UnstyledButton
                    onClick={() => (window.location.href = page.href || "/")}
                    sx={(theme) => ({
                      display: "block",
                      width: "100%",
                      padding: theme.spacing.xs,
                      borderRadius: theme.radius.sm,
                      marginTop: theme.spacing.xs / 2,
                      color:
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[0]
                          : theme.black,
                      backgroundColor:
                        router.pathname === page.href
                          ? theme.colorScheme === "dark"
                            ? theme.colors.dark[5]
                            : theme.colors.gray[1]
                          : undefined,
                      "&:hover": {
                        backgroundColor:
                          theme.colorScheme === "dark"
                            ? theme.colors.dark[6]
                            : theme.colors.gray[0],
                      },
                    })}
                    key={page.label}
                  >
                    <Group>
                      {page.badge ? (
                        <Indicator color={page.badge} size={12} withBorder>
                          <ThemeIcon color={page.color} variant="light">
                            {page.icon}
                          </ThemeIcon>
                        </Indicator>
                      ) : (
                        <ThemeIcon color={page.color} variant="light">
                          {page.icon}
                        </ThemeIcon>
                      )}

                      <Text size="sm">{page.label}</Text>
                    </Group>
                  </UnstyledButton>
                )
              ) : null
            )}
          </Navbar.Section>
          <Navbar.Section>
            {/* User Avatar */}
            {!!user && (
              <Box
                sx={{
                  paddingTop: theme.spacing.sm,
                  borderTop: `1px solid ${
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[4]
                      : theme.colors.gray[2]
                  }`,
                }}
              >
                <Menu
                  placement="center"
                  sx={{
                    width: "100%",
                  }}
                  control={
                    <UnstyledButton
                      sx={{
                        display: "block",
                        width: "100%",
                        padding: theme.spacing.xs,
                        borderRadius: theme.radius.sm,
                        color:
                          theme.colorScheme === "dark"
                            ? theme.colors.dark[0]
                            : theme.black,

                        "&:hover": {
                          backgroundColor:
                            theme.colorScheme === "dark"
                              ? theme.colors.dark[6]
                              : theme.colors.gray[0],
                        },
                      }}
                    >
                      <Group>
                        <Avatar src={user.picture} radius="xl" />
                        <Box sx={{ flex: 1 }}>
                          <Text size="sm" weight={500}>
                            {user.username}
                          </Text>
                          <Text color="dimmed" size="xs">
                            {user.discord}
                          </Text>
                        </Box>

                        {theme.dir === "ltr" ? (
                          <ChevronRight size={18} />
                        ) : (
                          <ChevronLeft size={18} />
                        )}
                      </Group>
                    </UnstyledButton>
                  }
                >
                  {user.uid != 0 ? (
                    <>
                      <Menu.Label>Application</Menu.Label>
                      <Menu.Item icon={<Settings size={14} />}>
                        Settings
                      </Menu.Item>
                      <Menu.Item
                        icon={
                          colorScheme === "dark" ? (
                            <Sun size={14} />
                          ) : (
                            <MoonStars size={14} />
                          )
                        }
                        onClick={() => toggleColorScheme()}
                        rightSection={
                          <Text size="xs" color="dimmed">
                            ⌘ J
                          </Text>
                        }
                      >
                        {colorScheme === "dark" ? "Lightmode" : "Darkmode"}
                      </Menu.Item>
                      <Menu.Item
                        icon={<Search size={14} />}
                        rightSection={
                          <Text size="xs" color="dimmed">
                            ⌘ K
                          </Text>
                        }
                      >
                        Search
                      </Menu.Item>
                      <Divider />
                      <Menu.Label>Danger Zone</Menu.Label>
                      <Menu.Item
                        icon={<Logout size={14} />}
                        onClick={() => {
                          setUser({ uid: 0 });
                          router.push("/");
                        }}
                      >
                        Log Out
                      </Menu.Item>
                      <Menu.Item color="red" icon={<Trash size={14} />}>
                        Delete my account
                      </Menu.Item>
                    </>
                  ) : (
                    <Menu.Item
                      icon={<Login size={14} />}
                      onClick={() => router.push("/login")}
                    >
                      Log in
                    </Menu.Item>
                  )}
                </Menu>
              </Box>
            )}
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header
          height={60}
          position={{ top: 0, left: 0 }}
          sx={{ width: "100vw", position: "fixed" }}
        >
          <Group sx={{ height: "100%" }} px={20} position="apart">
            <Group style={{ height: "100%" }}>
              <img
                src="/logo.png"
                alt="logo"
                style={{ height: "5vh", width: "5vh" }}
              />
              <Title sx={{ color: colorScheme === "dark" ? "white" : "black" }}>
                Progress
              </Title>
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>
            </Group>
            <Group style={{ height: "100%" }}>
              <ActionIcon
                variant="default"
                onClick={() => router.push("/milestones")}
                size={30}
                aria-label="Milestones"
              >
                <Confetti size={16} />
              </ActionIcon>
              <ActionIcon
                variant="default"
                onClick={() => toggleColorScheme()}
                size={30}
                aria-label="Toggle color scheme"
              >
                {colorScheme === "dark" ? (
                  <Sun size={16} />
                ) : (
                  <MoonStars size={16} />
                )}
              </ActionIcon>
            </Group>
          </Group>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Head>
        <title>
          Progress |{" "}
          {props.title ||
            pages.find((el: any) => el.href == router.pathname)?.label}
        </title>
        <meta name="title" content="Minefact Progress Tracking" />
        <meta name="keyworkds" content="progress, tracking, minefact, nyc, new york city, new york, minecraft, buildtheearth, mf,network, server, multiplayer" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="theme-color" content={theme.colors.blue[7]} />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content={theme.colors.blue[7]}
        />
        <meta
          name="msapplication-navbutton-color"
          content={theme.colors.blue[7]}
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="minefact Progress" />
        <meta name="application-name" content="Minefact Progress" />
        <meta
          name="description"
          content="We are tracking the Progress made on the Minefact New York City server as part of the Build the Earth Project."
        />
      </Head>
      <Box
        sx={{
          height: "calc(100vh - 60px)",
          width: "100%",
          overflow: "auto",
          overflowX: "hidden",
          ...props.style,
        }}
      >
        {props.scroll ? (
          <ScrollArea type="scroll">{props.children}</ScrollArea>
        ) : (
          props.children
        )}
      </Box>
    </AppShell>
  );
}
