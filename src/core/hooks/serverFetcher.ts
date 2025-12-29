import { io, Socket } from "socket.io-client";
import { type RenderJob } from "../types/types.ts";
import { useServerStore } from "../store/serverStore";
import { useCallback, useEffect, useRef } from "react";
import type {GetRenderJobsPagedResponse} from "@/core/types/responses.ts";

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

    const getRenderJobs = useCallback(
        async (page: number = 1): Promise<GetRenderJobsPagedResponse> => {
            if (!hostname)
                return {items: [], totalCount: 0};

            const response = await fetch(
                `${hostname}/${import.meta.env.VITE_API_GET}?count=${import.meta.env.VITE_DEFAULT_COUNT}&page=${page}`,
            );

            return await response.json();
    }, [hostname]);

    const getRenderJob = useCallback(
        async (id: string): Promise<RenderJob | null> => {
            if (!hostname)
                return null;

            let url = `${hostname}/${import.meta.env.VITE_API_GET}?id=${id}`;

            const response = await fetch(url);
            return await response.json();
        },
        [hostname]
    );

    return { getSocket, getRenderJobs, getRenderJob };
};