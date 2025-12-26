export interface RenderJob {
    id: string;
    frameStart: number;
    frameStep: number;
    frameEnd: number;
    currentFrame?: number;
    engine: string;
    timeStart: number;
    timeLastFrame?: number;
    project: string;
    resolutionX: number;
    resolutionY: number;
    state: RenderState;
}

export type RenderState = "started" | "inProgress" | "finished" | "canceled";
