import React, { createRef, useEffect } from "react";

import { renderSchematic } from "@enginehub/schematicwebviewer";

const SchematicViewer = ({
  schematic,
  options,
  style
}: {
  schematic: string;
  style?:any;
  options?: {
    size?: number; // Force the size of the canvas viewport, if not present use canvas size
    corsBypassUrl?: string; // A url of a cors-anywhere instance to allow access to MC server jars
    resourcePacks?: string[]; // A list of resource pack URLs in priority order
    renderBars?: boolean; // Whether a grid should be rendered
    renderArrow?: boolean; // Whether an arrow to show direction should be rendered
    orbit?: boolean; // Whether the view should automatically rotate when not being dragged by the user
    antialias?: boolean; // Whether antialiasing should be enabled
    backgroundColor?: number | "transparent"; // Background color of the canvas (default: 0xffffff)
  };
}) => {
  var canvasRef = createRef<HTMLCanvasElement>();
  useEffect(() => {
    //@ts-ignore
    renderSchematic(canvasRef.current, schematic, {
      corsBypassUrl: "https://api.allorigins.win/raw?url=",
      ...options,
    });
  });

  return (
      <canvas
      style={style}
        ref={canvasRef}
      ></canvas>
  );
};

export default SchematicViewer;
