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
  Search,
  Settings,
  Sun,
  User,
  UserPlus,
} from "tabler-icons-react";
import React, { useEffect, useState } from "react";

import Footer from "./Footer";
import Head from "next/head";
import pages from "../components/routes";
import { useRouter } from "next/router";
import { useSpotlight } from "@mantine/spotlight";
import useUser from "../utils/hooks/useUser";

export default function Page(props: {
  children: React.ReactNode;
  scroll?: boolean;
  noMargin?: boolean;
  noFooter?: boolean;
  style?: any;
  title?: string;
  delay?: number;
  navbar?: any;
}) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const router = useRouter();
  const spotlight = useSpotlight();
  const [user, setUser] = useUser();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, props?.delay || 500);
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
      padding={0}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={
        <Navbar
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <Navbar.Section grow p="sm">
            {props.navbar ? (
              props.navbar
            ) : (
              <>
                <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
                  <ScrollArea style={{ height: "82vh" }}>
                    {/* Page Navigation */}
                    {pages.map((page) =>
                      page.permission <= (user.permission || 0) ? (
                        page.divider ? (
                          <Divider
                            key={page.label}
                            my="sm"
                            size="sm"
                            label={page.label}
                          />
                        ) : (
                          <UnstyledButton
                            onClick={() =>
                              (window.location.href = page.href || "/")
                            }
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
                                <Indicator
                                  color={page.badge}
                                  size={12}
                                  withBorder
                                >
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
                  </ScrollArea>
                </MediaQuery>
                <MediaQuery largerThan={"sm"} styles={{ display: "none" }}>
                  <ScrollArea style={{ height: "77vh" }}>
                    {/* Page Navigation */}
                    {pages.map((page) =>
                      page.permission <= (user.permission || 0) ? (
                        page.divider ? (
                          <Divider
                            key={page.label}
                            my="sm"
                            size="sm"
                            label={page.label}
                          />
                        ) : (
                          <UnstyledButton
                            onClick={() =>
                              (window.location.href = page.href || "/")
                            }
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
                                <Indicator
                                  color={page.badge}
                                  size={12}
                                  withBorder
                                >
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
                  </ScrollArea>
                </MediaQuery>
              </>
            )}
          </Navbar.Section>
          <Navbar.Section>
            {/* User Avatar */}
            {!!user && (
              <Box
                sx={{
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
                      <Menu.Item
                        onClick={() => router.push("/users/" + user.username)}
                        icon={<User size={14} />}
                        rightSection={
                          <Text size="xs" color="dimmed">
                            ⌘ P
                          </Text>
                        }
                      >
                        Profile
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
                            ⌘ T
                          </Text>
                        }
                      >
                        {colorScheme === "dark" ? "Lightmode" : "Darkmode"}
                      </Menu.Item>
                      <Menu.Item
                        icon={<Search size={14} />}
                        onClick={spotlight.openSpotlight}
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
                        icon={<Settings size={14} />}
                        onClick={() =>
                          router.push("/users/" + user.username + "/settings")
                        }
                        rightSection={
                          <Text size="xs" color="dimmed">
                            ⌘ S
                          </Text>
                        }
                      >
                        Settings
                      </Menu.Item>
                      <Menu.Item
                        icon={<Logout size={14} />}
                        onClick={() => {
                          setUser({ uid: 0 });
                          router.push("/");
                        }}
                      >
                        Log Out
                      </Menu.Item>
                    </>
                  ) : (
                    <>
                      <Menu.Item
                        icon={<Login size={14} />}
                        onClick={() => router.push("/login")}
                      >
                        Log in
                      </Menu.Item>
                      <Menu.Item
                        icon={<UserPlus size={14} />}
                        onClick={() => router.push("/register")}
                      >
                        Request Account
                      </Menu.Item>
                    </>
                  )}
                </Menu>
              </Box>
            )}
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={70}>
          <Group
            sx={{ height: "100%", width: "100%", overflow: "hidden" }}
            px={20}
            position="apart"
          >
            <Group style={{ height: "100%" }}>
              <img
                src="/logo.gif"
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
        <meta
          name="keyworkds"
          content="progress, tracking, minefact, nyc, new york city, new york, minecraft, buildtheearth, mf,network, server, multiplayer"
        />
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
        <ScrollArea sx={{ height: "100%", width: "100%" }} scrollHideDelay={0}>
          <div
            style={{
              width: "100%",
              height: "100%",
              padding: props.noMargin ? "0px" : theme.spacing.md,
            }}
          >
            {props.scroll ? (
              <ScrollArea type="scroll">{props.children}</ScrollArea>
            ) : (
              props.children
            )}
          </div>
          {!props.noFooter && <Footer links={[]} />}
        </ScrollArea>
      </Box>
    </AppShell>
  );
}
