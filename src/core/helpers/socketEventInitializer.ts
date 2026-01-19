import { useSocketEvent } from "@/core/hooks/useSocketEvent.ts";
import { useRenderJobsStore } from "@/core/store/renderJobsStore.ts";
import type {RenderJob, RenderState} from "@/core/types/types.ts";

export function SocketEventInitializer() {
    const renderStart = useRenderJobsStore(s => s.renderStart);
    const frameUpdate = useRenderJobsStore(s => s.frameUpdate);
    const renderEnd = useRenderJobsStore(s => s.renderEnd);

    useSocketEvent("render-start", ({ jobId, job } : {jobId: string, job: RenderJob}) => {
        renderStart(jobId, job);
    });

    useSocketEvent("frame-update", ({ jobId, frame }: {jobId: string, frame: number}) => {
        frameUpdate(jobId, frame);
    });

    useSocketEvent("render-end", ({ jobId, state }: {jobId: string, state: RenderState}) => {
        renderEnd(jobId, state);
    });

    return null;
}