import {
  ActionIcon,
  Button,
  Center,
  Drawer,
  Text,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconMap, IconMoonStars, IconSun } from "@tabler/icons";

import { Data } from "victory";
import Head from "next/head";
import Image from "next/image";
import Map from "../components/map/BlockMap";
import type { NextPage } from "next";
import { Page } from "../components/Page";
import axios from "axios";
import { useState } from "react";

const Home: NextPage = ({}: any) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const theme = useMantineTheme();
  const [opened, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [extraData, setExtraData] = useState<any>(null);
  const setOpened = async (open: boolean) => {
    setOpen(open);
    if (open) {
      console.log(selected);
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/districts/` + selected.district
      );
      setExtraData({ ...extraData, district: data.data });
    }
  };
  return (
    <>
      <Page name="Map" icon={<IconMap />} noMargin>
        <Drawer
          opened={opened}
          onClose={() => setOpened(false)}
          padding="xl"
          size="xl"
        >
          <Title>
            {extraData?.district.name}, Block #{selected?.id}
          </Title>
        </Drawer>
        <Map
          onClick={(e, map) => {
            const bbox: any = [
              [e.point.x - 0, e.point.y - 0],
              [e.point.x + 0, e.point.y + 0],
            ];
            const selectedFeatures = map.queryRenderedFeatures(bbox, {
              layers: ["blocks-layer"],
            });
            if (selectedFeatures.length > 0) {
              console.log(selectedFeatures[0].properties);
              setSelected(selectedFeatures[0].properties);
              setOpened(true);
            }
          }}
        />
      </Page>
    </>
  );
};

export default Home;
  