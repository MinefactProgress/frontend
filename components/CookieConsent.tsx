import {
  Anchor,
  Button,
  CloseButton,
  Group,
  Paper,
  Text,
  useMantineTheme,
} from "@mantine/core";

import React from "react";
import useCookie from "../hooks/useCookie";
import { useRouter } from "next/router";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = React.useState(true);
  const theme = useMantineTheme();
  const router = useRouter();
  const cookie = useCookie();

  React.useEffect(() => {
    setShowConsent(cookie.hasCookie);
  }, [cookie.hasCookie]);

  const changeCookie = (state: boolean) => {
    setShowConsent(false);
    cookie.setConsent(state, 30);
    router.reload();
  };

  if (showConsent) {
    return null;
  }

  return (
    <Paper
      withBorder
      p="lg"
      m="lg"
      radius="md"
      shadow="md"
      style={{
        zIndex: 999,
        position: "fixed",
        bottom: 0,
        right: 0,
        maxWidth: "1000px",
      }}
    >
      <Group position="apart" mb="xs">
        <Text fz="md" fw={500}>
          Cookie Usage
        </Text>
        <CloseButton mr={-9} mt={-9} onClick={() => changeCookie(false)} />
      </Group>
      <Text c="dimmed" fz="xs">
        We are using Cookies to store essential information for our website to
        work. These Cookies include the so called &quot;theme&quot; and your
        login status. The Cookie information will not be shared outside of your
        browser. For more information please read our{" "}
        <Anchor href="/privacy#cookies">Privacy Policy</Anchor>
      </Text>
      <Group position="right" mt="md">
        <Button variant="default" size="xs" onClick={() => changeCookie(false)}>
          Decline
        </Button>
        <Button variant="outline" size="xs" onClick={() => changeCookie(true)}>
          Accept
        </Button>
      </Group>
    </Paper>
  );
};

export default CookieConsent;
