export interface RenderJob {
    id: string;
    frameStart: number;
    frameStep: number;
    frameEnd: number;
    engine: string;
    timeStart: number;
    timeLastFrame?: number;
    project: string;
    resolutionX: number;
    resolutionY: number;
    currentFrame?: number;
    frames?: JobFrame[];
    state: RenderState;
}

export interface JobFrame {
    id: string;
    jobId: string;
    frameNumber: number;
    timestamp: number;
}

export type RenderState = "started" | "inProgress" | "finished" | "canceled";
