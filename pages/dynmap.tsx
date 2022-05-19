import {
  Button,
  Group,
  Paper,
  SimpleGrid,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";

import Page from "../components/Page";

const DynmapPage = () => {
  const theme = useMantineTheme();
  return (
    <Page>
      <Paper
        withBorder
        radius="md"
        p="xs"
        style={{
          marginBottom: theme.spacing.md,
          height: "90vh",
        }}
      >
        <Title
          style={{
            marginBottom: theme.spacing.md,
          }}
        >
          Dynmap of New York City
        </Title>
        <iframe
          src="https://newyork.minefact.de/"
          height={"92.5%"}
          width={"100%"}
          style={{border:"none"}}
        />
      </Paper>
    </Page>
  );
};

export default DynmapPage;
