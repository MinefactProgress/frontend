import { AppShell, CSSObject } from "@mantine/core";
import {
  IconBuildingCommunity,
  IconBuildingMonument,
  IconCalendarEvent,
  IconChartBar,
  IconHierarchy,
  IconHome,
  IconMap,
  IconTool,
  IconUsers,
  TablerIcon,
} from "@tabler/icons";

import Head from "next/head";
import { Navbar } from "./Navbar";
import React from "react";
import { useRouter } from "next/router";
import useUser from "../hooks/useUser";

const homeLinks = [
  {
    icon: <IconChartBar />,
    label: "Progress Overview",
    href: "/",
    permission: 0,
  },
  {
    icon: <IconCalendarEvent />,
    label: "Event",
    href: "/event",
    permission: 1,
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
    icon: <IconMap />,
    label: "Map",
    href: "/map",
    permission: 0,
  },
  {
    icon: <IconTool />,
    label: "Admin Tools",
    href: "/admin",
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
  const [user] = useUser();
  var links = [...homeLinks];
  if (links.filter((l) => l.href == router.pathname).length < 1) {
    links.push({
      icon: props.icon,
      label: props.name,
      href: router.pathname,
      permission: 9,
    });
  }
  return (
    <>
      <Head>
        <title>Minefact Progress</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <AppShell
        navbar={<Navbar data={links} />}
        padding={props.noMargin ? 0 : undefined}
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
        {(user?.permission || 0) >=
        (links.find((l: any) => l.href == router.pathname)?.permission || 9) ? (
          props.children
        ) : (
          <h1>You dont have permissions to access this page</h1>
        )}
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