import { io, Socket } from "socket.io-client";
import { type AppKey, type RenderJob } from "../types/types.ts";
import { useServerStore } from "../store/serverStore";
import { useCallback, useEffect, useRef } from "react";
import type {GetRenderJobsPagedResponse} from "@/core/types/responses.ts";
import {authFetch} from "@/core/authHelper.ts";

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
                `${hostname}/api/render?count=${import.meta.env.VITE_DEFAULT_COUNT}&page=${page}`,
            );

            return await response.json();
        }, [hostname]);

    const getRenderJob = useCallback(
        async (id: string): Promise<RenderJob | null> => {
            if (!hostname)
                return null;

            let url = `${hostname}/api/render?id=${id}`;

            const response = await fetch(url);
            return await response.json();
        }, [hostname]);

    const registerUser = useCallback(
        async (name: string) => {
            if (!hostname)
                return null;

            const url = `${hostname}/api/user/`;

            const res = await authFetch(url, {
                method: "POST",
                body: JSON.stringify({ name: name }),
            });

            if (!res?.ok) {
                throw new Error("Could not sign in with the server");
            }

            return await res.json();
        }, [hostname]);

    const unregisterUser = useCallback(
        async () => {
            if (!hostname)
                return null;

            const url = `${hostname}/api/user/`;

            const res = await authFetch(url, {
                method: "DELETE"
            });

            if (!res?.ok) {
                throw new Error("Could not sign in with the server");
            }

            return await res.json();
        }, [hostname]);

    const createAppKey = useCallback(async (): Promise<AppKey | null>  => {
            if (!hostname)
                return null;

            const url = `${hostname}/api/apps/`;

            const res = await authFetch(url, {
                method: "POST"
            });

            if (!res?.ok) {
                throw new Error("Could not create app key");
            }

            return await res.json();
        }, [hostname]);

    const getAppKeys = useCallback(async (): Promise<AppKey[] | null> => {
        if (!hostname)
            return null;

        const url = `${hostname}/api/apps/`;

        const res = await authFetch(url, {
            method: "GET"
        });

        if (!res?.ok) {
            throw new Error("Could not create app key");
        }

        return await res.json();
    }, [hostname]);

    const deleteAppKey = useCallback(async (key: string) => {
        if (!hostname)
            return null;

        const url = `${hostname}/api/apps/${key}`;

        const res = await authFetch(url, {
            method: "DELETE"
        });

        if (!res?.ok) {
            throw new Error("Could not create app key");
        }

        return await res.json();
    }, [hostname]);

    return { getSocket, getRenderJobs, getRenderJob, registerUser, unregisterUser, createAppKey, getAppKeys, deleteAppKey };
};