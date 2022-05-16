/* eslint-disable @next/next/no-img-element */

import {
  ActionIcon,
  AppShell,
  Avatar,
  Box,
  Center,
  Divider,
  Group,
  Header,
  Indicator,
  Loader,
  Menu,
  Navbar,
  ScrollArea,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme
} from "@mantine/core";
import {
  ArrowsLeftRight,
  ChevronLeft,
  ChevronRight,
  MoonStars,
  Refresh,
  Search,
  Settings,
  Sun,
  Trash
} from "tabler-icons-react";
import { useEffect, useState } from "react";

import pages from "../components/routes";
import { useRouter } from "next/router";
import useUser from "../utils/hooks/useUser";

export default function Page(props: {
  children: React.ReactNode;
  scroll?: boolean;
}) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [loading, setLoading] = useState(true);
  const theme = useMantineTheme();
  const router = useRouter();
  const [user] = useUser();
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
      padding="md"
      navbar={
        <Navbar
          width={{ base: 300 }}
          p="xs"
          fixed
          position={{ top: 0, left: 0 }}
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
                  <Menu.Label>Application</Menu.Label>
                  <Menu.Item icon={<Settings size={14} />}>Settings</Menu.Item>
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
                  <Menu.Label>Contact</Menu.Label>
                  <Menu.Item icon={<ArrowsLeftRight size={14} />}>
                    Transfer my data
                  </Menu.Item>
                  <Menu.Item color="red" icon={<Trash size={14} />}>
                    Delete my account
                  </Menu.Item>
                </Menu>
              </Box>
            )}
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header
          height={60}
          fixed
          position={{ top: 0, left: 0 }}
          sx={{ width: "100vw" }}
        >
          <Group sx={{ height: "100%" }} px={20} position="apart">
            <Group style={{ height: "100%" }}>
              <img src="/logo.png" alt="logo" style={{ height: "90%" }} />
              <Title sx={{ color: colorScheme === "dark" ? "white" : "black" }}>
                Progress
              </Title>
            </Group>
            <Group style={{ height: "100%" }}>
            <ActionIcon
              variant="default"
              onClick={() => router.reload()}
              size={30}
            >
              <Refresh size={16} />
            </ActionIcon> <ActionIcon
              variant="default"
              onClick={() => toggleColorScheme()}
              size={30}
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
      <Box
        sx={{ marginLeft: 300, marginTop: 60, minHeight: "calc(100vh - 92px)" }}
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
