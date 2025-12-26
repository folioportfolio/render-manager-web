import { io, Socket } from "socket.io-client";
import { type RenderJob } from "../types/types.ts";
import { useServerStore } from "../store/serverStore";
import { useCallback, useEffect, useRef } from "react";

const API_GET = "api/render";
const DEFAULT_COUNT = 10;
const LOAD_COUNT = 5;

export const useFetcher = () => {
    const socketRef = useRef<Socket | null>(null);
    const hostname = useServerStore((s) => s.hostname);

    useEffect(() => {
        if (!hostname)
            return;

        const socket = io(hostname, { transports: ["websocket"] });
        socketRef.current = socket;

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [hostname]);

    const getSocket = useCallback(() => {
        return socketRef.current;
    }, []);

    const getRenderJobs = useCallback(async (): Promise<RenderJob[]> => {
        if (!hostname)
            throw new Error("No server configured");

        const response = await fetch(
            `${hostname}/${API_GET}?count=${DEFAULT_COUNT}`,
        );

        return await response.json();
    }, [hostname]);

    const getMoreRenderJobs = useCallback(
        async (cursor: string): Promise<RenderJob[]> => {
            if (!hostname)
                throw new Error("No server configured");

            let url = `${hostname}/${API_GET}?count=${LOAD_COUNT}&cursor=${cursor}`;

            const response = await fetch(url);
            return await response.json();
        },
        [hostname],
    );

    return { getSocket, getRenderJobs, getMoreRenderJobs };
};
