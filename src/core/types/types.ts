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
    state: RenderState;
    software?: string;
    version?: string;

    currentFrame?: number;
    frames?: JobFrame[];
}

export interface JobFrame {
    id: string;
    jobId: string;
    frameNumber: number;
    time: number;
    timestamp: number;
    info?: string;
}

export type RenderState = "started" | "inProgress" | "finished" | "canceled";
