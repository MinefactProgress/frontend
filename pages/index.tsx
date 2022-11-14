import {
  ActionIcon,
  Button,
  Center,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons";

import Head from "next/head";
import Image from "next/image";
import type { NextPage } from "next";

const Home: NextPage = ({}: any) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const theme = useMantineTheme();
  return (
    <>
    
    </>
  );
};

export default Home;
