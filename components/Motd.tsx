import TextTransition, { presets } from "react-text-transition";

import { Text } from "@mantine/core";
import useSocket from "../hooks/socket";
import { useState } from "react";

function Motd(props: { defaultText?: string }) {
  const [t, setText] = useState(props.defaultText || "Motd loading...");
  const socket = useSocket();
  socket.on("motd", (e: any) => {
    setText(e);
  });
  return (
    <Text>
      <TextTransition>{t}</TextTransition>
    </Text>
  );
}

export default Motd;
