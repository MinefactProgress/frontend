import { io } from "socket.io-client";
import useUser from "../utils/hooks/useUser";

var socket:any;

export function initializeSocket(url:string,apikey?:string) {
    if(socket) return;
    
    socket = io(url,{query:{key:apikey}})
}
export default function useSocket() {
    return socket;
}