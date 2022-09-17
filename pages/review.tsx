/* eslint-disable @next/next/no-img-element */

import { BuildingCommunity, History, Pin, User } from "tabler-icons-react";
import {
  Button,
  Divider,
  Grid,
  Group,
  Modal,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";

import Page from "../components/Page";
import SchematicViewer from "../components/SchematicViewer";
import { useState } from "react";

const ReviewPage = () => {
  const theme = useMantineTheme();
  const [action, setAction] = useState("");

  return (
    <Page noFooter>
      <Grid>
        <Grid.Col md={7}>
          <SchematicViewer
            schematic="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"
            options={{
              orbit: false,
              backgroundColor: 0x141517,
              antialias: true,
              renderArrow: true,
            }}
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              aspectRatio: "1/1",
            }}
          ></SchematicViewer>
        </Grid.Col>
        <Grid.Col md={5}>
          <h2>Project #4FeS1Y6K</h2>
          <UnstyledButton style={{ cursor: "default", width: "100%" }}>
            <Group>
              <ThemeIcon color="gray">
                <User size={16} />
              </ThemeIcon>
              <Text>SirSeretseKhama</Text>
            </Group>
          </UnstyledButton>
          <UnstyledButton
            style={{
              cursor: "default",
              width: "100%",
              marginTop: theme.spacing.xs,
            }}
          >
            <Group>
              <ThemeIcon color="gray">
                <BuildingCommunity size={16} />
              </ThemeIcon>
              <Text>Residential Building</Text>
            </Group>
          </UnstyledButton>
          <UnstyledButton
            style={{
              cursor: "default",
              width: "100%",
              marginTop: theme.spacing.xs,
            }}
          >
            <Group>
              <ThemeIcon color="gray">
                <Pin size={16} />
              </ThemeIcon>
              <Text>40.65271503998676, -73.84051736872424</Text>
            </Group>
          </UnstyledButton>
          <UnstyledButton
            style={{ width: "100%", marginTop: theme.spacing.xs }}
            onClick={() => setAction("history")}
          >
            <Group>
              <ThemeIcon>
                <History size={16} />
              </ThemeIcon>
              <Text>Click to view History</Text>
            </Group>
          </UnstyledButton>

          <div style={{ width: "250px" }}>
            <Divider my="md" label="Links" />
            <Button
              fullWidth
              style={{ marginTop: theme.spacing.xs }}
              leftIcon={
                <img
                  src="google-maps-logo.svg"
                  width="16px"
                  alt="Google Maps Logo"
                />
              }
            >
              Google Maps
            </Button>
            <Button
              fullWidth
              style={{ marginTop: theme.spacing.xs }}
              leftIcon={
                <img
                  src="google-earth-logo.svg"
                  width="16px"
                  alt="Google Earth Logo"
                />
              }
            >
              Google Earth
            </Button>
            <Button
              fullWidth
              style={{ marginTop: theme.spacing.xs }}
              leftIcon={
                <img
                  src="openstreetmaps-logo.svg"
                  width="16px"
                  alt="OpenStreetMaps Logo"
                />
              }
            >
              OpenStreetMaps
            </Button>
            <Divider my="md" label="Actions" />
            <Button
              fullWidth
              style={{ marginTop: theme.spacing.xs }}
              color="green"
              onClick={() => setAction("accept")}
            >
              Accept
            </Button>
            <Button
              fullWidth
              style={{ marginTop: theme.spacing.xs }}
              color="red"
              onClick={() => setAction("decline")}
            >
              Decline
            </Button>
            <Button
              fullWidth
              style={{ marginTop: theme.spacing.xl }}
              variant="outline"
            >
              Skip Review
            </Button>
            <Modal
            centered 
              opened={action == "accept"}
              onClose={() => setAction("")}
              title="Accept Project #4FeS1Y6K"
            >
            </Modal>
          </div>
        </Grid.Col>
      </Grid>
    </Page>
  );
};

export default ReviewPage;
