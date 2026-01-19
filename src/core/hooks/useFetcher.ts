import { type AppKey, type RenderJob } from "../types/types.ts";
import { useServerStore } from "../store/serverStore";
import { useCallback } from "react";
import type {GetRenderJobsPagedResponse} from "@/core/types/responses.ts";
import {authFetch} from "@/core/helpers/authHelper.ts";
import {useAuth} from "@/core/contexts/authContext.tsx";

export const useFetcher = () => {
    const hostname = useServerStore((s) => s.hostname);
    const { user, loading } = useAuth();

    const getRenderJobs = useCallback(
        async (page: number = 1): Promise<GetRenderJobsPagedResponse> => {
            if (!hostname || !user)
                return {items: [], totalCount: 0};

            const response = await authFetch(
                `${hostname}/api/render?count=${import.meta.env.VITE_DEFAULT_COUNT}&page=${page}`,
            );

            if (!response?.ok) {
                throw new Error(`Failed to retrieve render jobs: ${response?.statusText}`);
            }

            return await response.json();
        }, [hostname, user, loading]);

    const getRenderJob = useCallback(
        async (id: string): Promise<RenderJob | null> => {
            if (!hostname || !user)
                return null;

            let url = `${hostname}/api/render?id=${id}`;

            const response = await authFetch(url);

            if (!response?.ok) {
                throw new Error("Failed to retrieve render job");
            }

            return await response.json();
        }, [hostname, user, loading]);

    const registerUser = useCallback(
        async (name: string) => {
            if (!hostname || !user)
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
        }, [hostname, user, loading]);

    const unregisterUser = useCallback(
        async () => {
            if (!hostname || !user)
                return null;

            const url = `${hostname}/api/user/`;

            const res = await authFetch(url, {
                method: "DELETE"
            });

            if (!res?.ok) {
                throw new Error("Could not sign in with the server");
            }

            return await res.json();
        }, [hostname, user, loading]);

    const createAppKey = useCallback(async (): Promise<AppKey | null>  => {
            if (!hostname || !user)
                return null;

            const url = `${hostname}/api/apps/`;

            const res = await authFetch(url, {
                method: "POST"
            });

            if (!res?.ok) {
                throw new Error("Could not create app key");
            }

            return await res.json();
        }, [hostname, user, loading]);

    const getAppKeys = useCallback(async (): Promise<AppKey[] | null> => {
        if (!hostname || !user)
            return null;

        const url = `${hostname}/api/apps/`;

        const res = await authFetch(url, {
            method: "GET"
        });

        if (!res?.ok) {
            throw new Error("Could not create app key");
        }

        return await res.json();
    }, [hostname, user, loading]);

    const deleteAppKey = useCallback(async (key: string) => {
        if (!hostname || !user)
            return null;

        const url = `${hostname}/api/apps/${key}`;

        const res = await authFetch(url, {
            method: "DELETE"
        });

        if (!res?.ok) {
            throw new Error("Could not create app key");
        }

        return await res.json();
    }, [hostname, user, loading]);

    return { getRenderJobs, getRenderJob, registerUser, unregisterUser, createAppKey, getAppKeys, deleteAppKey };
};