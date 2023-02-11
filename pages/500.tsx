import {
  ActionIcon,
  Button,
  Center,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconBug, IconMoonStars, IconSun } from "@tabler/icons";

import { Error } from "../components/Error";
import Head from "next/head";
import Image from "next/image";
import type { NextPage } from "next";
import { Page } from "../components/Page";

const Home: NextPage = ({}: any) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const theme = useMantineTheme();
  return (
    <Page name="500" icon={<IconBug />} noMargin>
      <Error error={500} />
    </Page>
  );
};

export default Home;
