import {
  ActionIcon,
  Button,
  Center,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconHome, IconMoonStars, IconSun } from "@tabler/icons";

import Head from "next/head";
import Image from "next/image";
import type { NextPage } from "next";
import { Page } from "../components/Page";

const Home: NextPage = ({}: any) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const theme = useMantineTheme();
  return (
    <Page name="Home" icon={<IconHome />}>
      dd
    </Page>
  );
};

export default Home;
