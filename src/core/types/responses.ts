import type {RenderJob} from "@/core/types/types.ts";

export type GetRenderJobsPagedResponse = {
    items: RenderJob[];
    totalCount: number;
}