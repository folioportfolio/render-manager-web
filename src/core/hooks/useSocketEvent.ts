import { useEffect } from "react";
import { useSocket } from "@/core/contexts/socketContext.tsx";

export type SocketEvent =  "render-start" | "render-end" | "frame-update";

export function useSocketEvent<T>(
    event: SocketEvent,
    handler: (payload: T) => void
) {
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on(event, handler);
        return () => {
            socket.off(event, handler);
        };
    }, [socket, event, handler]);
}