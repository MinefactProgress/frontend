import Map from "../components/Map";
import Page from "../components/Page";

const Testmap = () => {
  return (
    <Page title="Testmap">
      <div
        style={{
          width: "100%",
          height: "calc(100vh - 60px)",
          position: "relative",
        }}
      >
        <Map width="100%" height="100%" drawable></Map>
      </div>
    </Page>
  );
};

export default Testmap;
