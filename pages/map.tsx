import {
  ActionIcon,
  Button,
  Center,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconMap, IconMoonStars, IconSun } from "@tabler/icons";

import Head from "next/head";
import Image from "next/image";
import Map from "../components/map/Map";
import type { NextPage } from "next";
import { Page } from "../components/Page";

const Home: NextPage = ({}: any) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const theme = useMantineTheme();
  return (
    <>
      <Page name="Map" icon={<IconMap />} noMargin>
        <Map />
      </Page>
    </>
  );
};

export default Home;
