import {create} from "zustand";
import type {RenderJob, RenderState} from "@/core/types/types.ts";

interface RenderJobsState {
    jobs: Map<string, RenderJob>;
    currentPage: number;
    maxPages: number;

    setPage: (page: number) => void;
    setJobsFromApi: (items: RenderJob[], total: number) => void;

    renderStart: (jobId: string, job: RenderJob) => void;
    frameUpdate: (jobId: string, frame: number) => void;
    renderEnd: (jobId: string, state: RenderState) => void;

    reset: () => void;
}

export const useRenderJobsStore = create<RenderJobsState>((set) => ({
    jobs: new Map(),
    currentPage: 1,
    maxPages: 1,

    setPage: (page) => set({ currentPage: page }),

    setJobsFromApi: (items: RenderJob[], total: number) =>
        set(() => {
            const map = new Map<string, RenderJob>();
            items.forEach(job => map.set(job.id, job));

            return {
                jobs: map,
                maxPages: Math.ceil(
                    total / import.meta.env.VITE_DEFAULT_COUNT
                ),
            };
        }),

    renderStart: (jobId, job) =>
        set((state) => {
            const next = new Map(state.jobs);
            next.set(jobId, job);
            return { jobs: next };
        }),

    frameUpdate: (jobId, frame) =>
        set((state) => {
            const next = new Map(state.jobs);
            const job = next.get(jobId);

            if (job) {
                next.set(jobId, {
                    ...job,
                    currentFrame: frame,
                    timeLastFrame: Date.now() / 1000,
                    state: "inProgress",
                });
            }

            return { jobs: next };
        }),

    renderEnd: (jobId, stateValue) =>
        set((state) => {
            const next = new Map(state.jobs);
            const job = next.get(jobId);

            if (job) {
                next.set(jobId, {
                    ...job,
                    state: stateValue,
                });
            }

            return { jobs: next };
        }),

    reset: () =>
        set({
            jobs: new Map(),
            currentPage: 1,
            maxPages: 1,
        }),
}));