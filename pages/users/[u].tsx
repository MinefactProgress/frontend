import {
  Avatar,
  Badge,
  Button,
  Center,
  Group,
  Progress,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { colorFromStatus, progressToColorName } from "../../utils/blockUtils";

import Map from "../../components/Map";
import Page from "../../components/Page";
import { getRoleFromPermission } from "../../utils/hooks/usePermission";
import { rankToColor } from "../../utils/userUtils";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useState } from "react";
import useUser from "../../utils/hooks/useUser";

const UserPage = () => {
  const router = useRouter();
  const theme = useMantineTheme();
  const [selectedBlock, setSelectedBlock] = useState({
    block: {
      uid: 0,
      id: 0,
      district: -1,
      status: -1,
      progress: 0,
      details: false,
      builder: "",
      completionDate: null,
      area: "[]",
    },
    district: "",
  });
  const { u } = router.query;
  const [user] = useUser();
  const { data } = useSWR(`/api/users/get/${u}`);
  const { data: claims } = useSWR(`/api/claims/${u}`);
  const { data: rndImage } = useSWR(`/api/admin/getRandomImage`);
  var image = data?.image;
  if (!image) {
    image = rndImage?.link;
  }
  var claimsPolygons: any[] | null = null;
  if (claims && !claimsPolygons) {
    claimsPolygons = [];
    claims?.claims.districts.map((district: any) => {
      district.blocks?.map((block: any) => {
        // @ts-ignore
        claimsPolygons.push({
          type: "polygon",
          positions: block.area,
          options: {
            color: `${colorFromStatus(block.status, true)}FF`,
            opacity:
                    selectedBlock.block.uid != 0
                      ? block.uid == selectedBlock.block.uid
                        ? 1
                        : 0.05
                      : 0.5,
          },
          radius: 15,
          tooltip:
            district.name +
            " #" +
            block.id +
            " | " +
            (block.status == 1 ? block.builder : block.progress + "%"),
          eventHandlers: {
            click: () => {
              setSelectedBlock({ block: block, district: district.name });
            },
          },
        });
      });
    });
  }
  return (
    <Page noMargin style={{ position: "relative" }} title={u?.toString()}>
      <div
        style={{
          backgroundColor: "white",
          background: `url(${image}) center center / cover`,
          width: "100%",
          height: "40vh",
        }}
      ></div>
      <Center
        style={{
          width: "100%",
          height: "40vh",
          position: "absolute",
          top: 0,
          left: 0,
          background: "rgba(0,0,0,0.7)",
        }}
      >
        <Avatar size={theme.spacing.xl * 6} src={data?.picture} radius={2000}>
          {(u || [""]).toString().charAt(0)}
        </Avatar>
        <Stack
          align="flex-start"
          spacing="xs"
          style={{
            marginLeft: theme.spacing.xl,
          }}
        >
          <Title
            style={{
              color: "white",
              fontSize: theme.fontSizes.xl * 3,
              userSelect: "none",
            }}
          >
            {u}
          </Title>
          <Badge
            style={{
              backgroundColor: rankToColor(data?.rank) + "bb",
              color: "#FFFFFF",
              opacity: 1,
              marginTop: theme.spacing.xs,
            }}
          >
            {data?.rank}
          </Badge>
        </Stack>
      </Center>
      <Progress
        value={(claims?.claims.done / claims?.claims.total) * 100}
        color={progressToColorName(
          (claims?.claims.done / claims?.claims.total) * 100
        )}
        radius={0}
        styles={{ root: { backgroundColor: "#00000000" } }}
        style={{ marginTop: -theme.spacing.md / 4 }}
      />
      <div>
        <Group
          style={{
            position: "absolute",
            zIndex: 2,
            bottom: theme.spacing.md,
            width: "45vw",
          }}
          position="center"
        >
          {selectedBlock.block.uid != 0 && (
            <Button
              variant="filled"
              color="gray"
              radius="xl"
              size="md"
              onClick={() => {
                router.push(
                  "/districts/" + selectedBlock.district + "/" + selectedBlock.block.id
                );
              }}
              style={{
                boxShadow: theme.shadows.md,
              }}
            >
              View Block Stats
            </Button>
          )}
        </Group>
        <Map
          width="45vw"
          height="53vh"
          zoom={13}
          polygon={{ data: data?.area || [] }}
          mapStyle={{ zIndex: 0 }}
          components={claimsPolygons}
        ></Map>
      </div>
    </Page>
  );
};

export default UserPage;
