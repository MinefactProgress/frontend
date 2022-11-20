import {
  IconBuildingCommunity,
  IconBuildingMonument,
  IconChartBar,
  IconHierarchy,
  IconHome,
  IconMap,
  IconTool,
  IconUsers,
  TablerIcon,
} from "@tabler/icons";

import { AppShell } from "@mantine/core";
import Head from "next/head";
import { Navbar } from "./Navbar";
import { useRouter } from "next/router";

const homeLinks = [
  { icon: <IconHome />, label: "Home", href: "/" },
  {
    icon: <IconChartBar />,
    label: "Progress Overview",
    href: "/progress",
  },
  {
    icon: <IconBuildingCommunity />,
    label: "Districts",
    href: "/districts",
  },
  {
    icon: <IconUsers />,
    label: "Staff Team",
    href: "/staff",
  },
  {
    icon: <IconHierarchy />,
    label: "Network",
    href: "/network",
  },
  {
    icon: <IconBuildingMonument />,
    label: "Landmarks",
    href: "/landmarks",
  },
  {
    icon: <IconMap />,
    label: "Map",
    href: "/map",
  },
  {
    icon: <IconTool />,
    label: "Admin Tools",
    href: "/admin",
  },
];

export const Page = (props: {
  children: any;
  name: string;
  icon: any;
  noMargin?: boolean;
}) => {
  const router = useRouter();
  var links = [...homeLinks];
  if (links.filter((l) => l.href == router.pathname).length < 1) {
    links.push({ icon: props.icon, label: props.name, href: router.pathname });
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
          },
        })}
      >
        {props.children}
      </AppShell>
    </>
  );
};
