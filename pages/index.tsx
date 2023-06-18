import {
  ActionIcon,
  Badge,
  Button,
  Group,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconMap, IconX } from "@tabler/icons";
import Map, {
  mapCopyCoordinates,
  mapHoverEffect,
  mapLoadGeoJson,
  mapStatusColorLine,
  mapStatusColorPolygon,
} from "../components/map/Map";
import { useClipboard, useDebouncedValue } from "@mantine/hooks";

import Chat from "../components/Chat";
import type { NextPage } from "next";
import { Page } from "../components/Page";
import React from "react";
import { mapClickEvent } from "../components/map/Map";
import { statusToColorName } from "../util/block";
import { useRouter } from "next/router";
import useSocket from "../hooks/useSocket";
import { useState } from "react";
import useUser from "../hooks/useUser";

const Home: NextPage = ({}: any) => {
  const theme = useMantineTheme();
  const clipboard = useClipboard();
  const socket = useSocket();
  const router = useRouter();
  const [filteredStatus, setFilteredStatus] = useState<number>(-1);
  const [debouncedFiltertedStatus] = useDebouncedValue(filteredStatus, 100);

  return (
    <Page name="Map" icon={<IconMap />} noMargin>
      <Group
        style={{
          position: "absolute",
          left: "90px",
          top: "10px ",
          zIndex: 1,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <Button onClick={() => router.push("/dynmap")}>View Dynmap</Button>
        <Badge
          color={statusToColorName(0)}
          size="lg"
          variant={debouncedFiltertedStatus == 0 ? "filled" : "outline"}
          style={{
            backgroundColor:
              debouncedFiltertedStatus != 0
                ? theme.colorScheme == "dark"
                  ? theme.colors.dark[7]
                  : theme.white
                : undefined,
          }}
          onClick={() => setFilteredStatus(0)}
        >
          Not Started
        </Badge>
        <Badge
          color={statusToColorName(1)}
          size="lg"
          variant={debouncedFiltertedStatus == 1 ? "filled" : "outline"}
          style={{
            backgroundColor:
              debouncedFiltertedStatus != 1
                ? theme.colorScheme == "dark"
                  ? theme.colors.dark[7]
                  : theme.white
                : undefined,
          }}
          onClick={() => setFilteredStatus(1)}
        >
          Reserved
        </Badge>
        <Badge
          color={statusToColorName(2)}
          size="lg"
          variant={debouncedFiltertedStatus == 2 ? "filled" : "outline"}
          style={{
            backgroundColor:
              debouncedFiltertedStatus != 2
                ? theme.colorScheme == "dark"
                  ? theme.colors.dark[7]
                  : theme.white
                : undefined,
          }}
          onClick={() => setFilteredStatus(2)}
        >
          Building
        </Badge>
        <Badge
          color={statusToColorName(3)}
          size="lg"
          variant={debouncedFiltertedStatus == 3 ? "filled" : "outline"}
          style={{
            backgroundColor:
              debouncedFiltertedStatus != 3
                ? theme.colorScheme == "dark"
                  ? theme.colors.dark[7]
                  : theme.white
                : undefined,
          }}
          onClick={() => setFilteredStatus(3)}
        >
          Detailing
        </Badge>
        <Badge
          color={statusToColorName(4)}
          size="lg"
          variant={debouncedFiltertedStatus == 4 ? "filled" : "outline"}
          style={{
            backgroundColor:
              debouncedFiltertedStatus != 4
                ? theme.colorScheme == "dark"
                  ? theme.colors.dark[7]
                  : theme.white
                : undefined,
          }}
          onClick={() => setFilteredStatus(4)}
        >
          Done
        </Badge>
        {filteredStatus >= 0 && (
          <ActionIcon
            size="sm"
            radius="xl"
            variant="outline"
            style={{
              backgroundColor: theme.colorScheme === "dark" ? "black" : "white",
            }}
            onClick={() => {
              setFilteredStatus(-2);
            }}
          >
            <IconX size={16} />
          </ActionIcon>
        )}
      </Group>
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
            debouncedFiltertedStatus != -1
              ? debouncedFiltertedStatus
              : undefined,
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
        statusFilter={{
          layers: ["blocks-layer", "blocks-layer-outline"],
          status:
            debouncedFiltertedStatus != -1
              ? debouncedFiltertedStatus
              : undefined,
        }}
      />
    </Page>
  );
};

export default Home;
