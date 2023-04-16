import { Image, Notification, ScrollArea } from "@mantine/core";
import { useEffect, useState } from "react";
import { useInterval, useQueue } from "@mantine/hooks";

import useSocket from "../hooks/useSocket";

function Chat({
  allowChat,
  socketEvents,
  style,
}: {
  allowChat?: boolean;
  style?: React.CSSProperties;
  socketEvents: {
    join?: string;
    leave?: string;
    chat: string;
    response?: string;
  };
}) {
  const socket = useSocket();
  const interval = useInterval(() => state.shift(), 5000);

  const {
    state,
    queue,
    add: addTQ,
    update,
    cleanQueue,
  } = useQueue<{
    msg: string;
    user: string;
  }>({
    initialValues: [],
    limit: 10,
  });

  function add(props: { msg: string; user: string }) {
    if (state.length >= 10) {
      state.shift();
    }
    addTQ(props);
  }

  socket.off(socketEvents.chat).on(socketEvents.chat, (e: any) => {
    const d = JSON.parse(e);
    add({ msg: d.message, user: d.username });
  });

  if (socketEvents.join) {
    socket.off(socketEvents.join).on(socketEvents.join, (e: any) => {
      const d = JSON.parse(e);
      add({ msg: `joined`, user: d.username });
    });
  }

  if (socketEvents.leave) {
    socket.off(socketEvents.leave).on(socketEvents.leave, (e: any) => {
      const d = JSON.parse(e);
      add({ msg: `left`, user: d.username });
    });
  }

  useEffect(() => {
    interval.start();
    return interval.stop;
  });

  return (
    <div style={style}>
      {state.map((s, i) => (
        <Notification
          disallowClose
          mt="xs"
          color="green"
          title={s.user}
          icon={
            <Image
              src={`https://mc-heads.net/avatar/${s.user}`}
              alt={s.user}
              radius="md"
            />
          }
          key={i}
        >
          {s.msg}
        </Notification>
      ))}
    </div>
  );
}

export default Chat;
