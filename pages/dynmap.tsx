import Page from "../components/Page";
import React from "react";
import {
  useMantineTheme,
} from "@mantine/core";

const DynmapPage = () => {
  const theme = useMantineTheme();
  return (
    <Page noMargin noFooter style={{overflow:"hidden"}}>
     <iframe
          src="https://newyork.minefact.de/"
          style={{ border: "none",padding:"none",margin:"none",height:"calc(100vh - 70px)",width:"100%" }}
        />
    </Page>
  );
};

export default DynmapPage;
