import { io } from "socket.io-client";

var socket: any;
var apiKey: string;

export function initializeSocket(url: string, apikey?: string) {
  if (socket) return;
  apiKey = apikey || "";

  socket = io(url);
}
export default function useSocket() {
  return socket;
}
export function socketBody(content: any) {
  return { apiKey, data: content };
}
