import { io } from "socket.io-client";

var socket: any;
var apiKey: string;

export function initializeSocket(
  url: string,
  rooms: string[],
  apikey?: string
) {
  if (socket) return;
  apiKey = apikey || "";

  socket = io(url);

  for (const room of rooms) {
    socket.emit("join", socketBody({ room }));
  }
}
export default function useSocket() {
  return socket;
}
export function socketBody(content: any) {
  return { apiKey, data: content };
}
