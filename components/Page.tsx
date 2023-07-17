import {
  Anchor,
  AppShell,
  CSSObject,
  Container,
  Group,
  Paper,
} from "@mantine/core";
import {
  IconBuildingCommunity,
  IconBuildingMonument,
  IconCalendarEvent,
  IconChartBar,
  IconHierarchy,
  IconMap,
  IconTool,
  IconUsers,
} from "@tabler/icons";

import Head from "next/head";
import { Navbar } from "./Navbar";
import React from "react";
import { useRouter } from "next/router";

const homeLinks = [
  {
    icon: <IconMap />,
    label: "Map",
    href: "/",
    permission: 0,
  },
  {
    icon: <IconChartBar />,
    label: "Progress Overview",
    href: "/dashboard",
    permission: 0,
  },
  {
    icon: <IconCalendarEvent />,
    label: "Event",
    href: "/event",
    permission: 0,
  },
  {
    icon: <IconBuildingCommunity />,
    label: "Districts",
    href: "/districts",
    permission: 0,
  },
  {
    icon: <IconUsers />,
    label: "Staff Team",
    href: "/staff",
    permission: 0,
  },
  {
    icon: <IconHierarchy />,
    label: "Network",
    href: "/network",
    permission: 0,
  },
  {
    icon: <IconBuildingMonument />,
    label: "Landmarks",
    href: "/landmarks",
    permission: 0,
  },
  {
    icon: <IconTool />,
    label: "Admin Tools",
    href: "/admin/dashboard/users",
    permission: 3,
  },
];

export const Page = (props: {
  children: any;
  name: string;
  icon: any;
  noMargin?: boolean;
  style?: CSSObject;
}) => {
  const router = useRouter();
  var links = [...homeLinks];
  if (links.filter((l) => l.href == router.pathname).length < 1) {
    links.push({
      icon: props.icon,
      label: props.name,
      href: router.pathname,
      permission: 0,
    });
  }
  return (
    <>
      <Head>
        <title>Minefact Progress - {props.name.toString()}</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <AppShell
        navbar={<Navbar data={links} />}
        padding={props.noMargin ? 0 : undefined}
        footer={
          <Paper withBorder>
            <Container>
              <Group position="apart">
                <p>
                  Copyright &copy; {new Date().getFullYear()} Minefact Progress
                </p>
                <Group>
                  <Anchor<"a"> color="dimmed" size="sm" href="privacy">
                    Privacy
                  </Anchor>
                  <Anchor<"a"> color="dimmed" size="sm">
                    Discord
                  </Anchor>
                </Group>
              </Group>
            </Container>
          </Paper>
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
            minHeight: "100vh",
            maxWidth: "100%",
            overflowX: "hidden",

            ...props.style,
          },
        })}
      >
        {props.children}
      </AppShell>
    </>
  );
};

function hasPermission(needed: number, permission?: number) {
  if (!permission) {
    if (needed != 0) return false;
    return true;
  }

  return permission >= needed;
}
