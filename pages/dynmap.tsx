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
    <Page noMargin style={{overflow:"hidden"}}>
     <iframe
          src="https://newyork.minefact.de/"
          height="100%"
          width="100%"
          style={{ border: "none",padding:"none",margin:"none" }}
        />
    </Page>
  );
};

export default DynmapPage;
