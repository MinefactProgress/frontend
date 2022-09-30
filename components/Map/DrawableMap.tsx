import { useLeafletContext } from "@react-leaflet/core";
import { useEffect } from "react";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

const DrawableMap = () => {
  const context = useLeafletContext();

  useEffect(() => {
    const leafletContainter = context.layerContainer || context.map;

    // Configure Map
    leafletContainter.pm.addControls({
      position: "topright",
    });

    leafletContainter.pm.setGlobalOptions({ pmIgnore: false });
    leafletContainter.pm.setPathOptions({ color: "#fcb603" });

    leafletContainter.on("pm:create", (e: any) => {
      if (e.layer && e.layer.pm) {
        const shape = e;
        console.log(e);

        shape.layer.pm.enable();

        console.log(`object created: ${shape.layer.pm.getShape()}`);

        leafletContainter.pm
          .getGeomanLayers(true)
          .bindPopup("i am whole")
          .openPopup();
        leafletContainter.pm
          .getGeomanLayers()
          .map((layer: any, index: number) =>
            layer.bindPopup(`I am figure N° ${index}`)
          );
        shape.layer.on("pm:edit", (e: any) => {
          console.log(e);
        });
      }
    });
    leafletContainter.on("pm:remove", (e: any) => {
      console.log("object removed");
    });

    return () => {
      leafletContainter.pm.removeControls();
      leafletContainter.pm.setGlobalOptions({ pmIgnore: true });
    };
  }, [context]);

  return null;
};

export default DrawableMap;
