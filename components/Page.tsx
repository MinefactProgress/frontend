import {
  IconBuildingCommunity,
  IconBuildingMonument,
  IconChartBar,
  IconHierarchy,
  IconHome,
  IconMap,
  IconTool,
  IconUsers,
} from "@tabler/icons";

import { AppShell } from "@mantine/core";
import Head from "next/head";
import { Navbar } from "./Navbar";

export const Page = (props: { children: any }) => {
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
      navbar={
        <Navbar
          data={[
            { icon: IconHome, label: "Home", href: "/" },
            {
              icon: IconChartBar,
              label: "Progress Overview",
              href: "/progress",
            },
            {
              icon: IconBuildingCommunity,
              label: "Districts",
              href: "/districts",
            },
            {
              icon: IconUsers,
              label: "Staff Team",
              href: "/staff",
            },
            {
              icon: IconHierarchy,
              label: "Network",
              href: "/network",
            },
            {
              icon: IconBuildingMonument,
              label: "Landmarks",
              href: "/landmarks",
            },
            {
              icon: IconMap,
              label: "Map",
              href: "/map",
            },
            {
              icon: IconTool,
              label: "Admin Tools",
              href: "/admin",
            },
          ]}
        />
      }
      padding="md"
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {props.children}
    </AppShell></>
  );
};
