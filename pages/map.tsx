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
import Map, {
  mapCopyCoordinates,
  mapHoverEffect,
  mapLoadGeoJson,
  mapStatusColorLine,
  mapStatusColorPolygon,
} from "../components/map/Map";
import { useEffect, useState } from "react";

import Chat from "../components/Chat";
import { Data } from "victory";
import Head from "next/head";
import Image from "next/image";
import type { NextPage } from "next";
import { NotificationsProvider } from "@mantine/notifications";
import { Page } from "../components/Page";
import axios from "axios";
import { mapClickEvent } from "../components/map/Map";
import { useClipboard } from "@mantine/hooks";
import { useRouter } from "next/router";
import useSocket from "../hooks/useSocket";
import useUser from "../hooks/useUser";

const Home: NextPage = ({}: any) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [user] = useUser();
  const theme = useMantineTheme();
  const clipboard = useClipboard();
  const socket = useSocket();
  const [selected, setSelected] = useState<any>(null);
  const [extraData, setExtraData] = useState<any>(null);
  const router = useRouter();

  return (
    <>
      <Page name="Map" icon={<IconMap />} noMargin>
        <Chat
          socketEvents={{
            join: "player_join",
            leave: "player_leave",
            chat: "player_chat",
            response: "frontend_chat",
          }}
          style={{
            position: "absolute",
            zIndex: 88,
            bottom: theme.spacing.md,
            left: 80 + theme.spacing.md,
          }}
        />
        <Map
          showPlayers
          layerSetup={async (map: any) => {
            await mapLoadGeoJson(
              map,
              `${process.env.NEXT_PUBLIC_API_URL}/v1/map`,
              "blocks-layer",
              "fill",
              "blocks",
              mapStatusColorPolygon,
              mapStatusColorLine
            );
          }}
          onMapLoaded={async (map: any) => {
            mapHoverEffect(
              map,
              "blocks-layer",
              "blocks",
              (f) => "Block #" + f.properties.uid
            );
            mapClickEvent(map, "blocks-layer", (f) => {
              router.push("/districts/" + f.properties.district);
            });
            mapCopyCoordinates(map, clipboard, socket);
          }}
        />
      </Page>
    </>
  );
};

export default Home;
