import { IconMap } from "@tabler/icons";
import { Page } from "../components/Page";

const Dynmap = () => {
  return (
    <Page name="Dynmap" noMargin icon={<IconMap />}>
      <iframe
        src="https://newyork.minefact.de"
        style={{
          border: "none",
          padding: "none",
          margin: "none",
          height: "100vh",
          width: "100%",
        }}
      />
    </Page>
  );
};

export default Dynmap;
