import { format } from "date-fns";
import { type RenderState } from "../core/types/types";
import {Progress} from "@/ui/Progress.tsx";
import {Card, CardAction, CardContent, CardFooter, CardHeader} from "@/ui/Card.tsx";
import type {HTMLAttributes} from "react";
import {getRenderState} from "@/helpers/renderStateHelper.tsx";

export interface RenderInfoProps extends HTMLAttributes<HTMLDivElement> {
    id: string;
    frameStart: number;
    frameEnd: number;
    currentFrame?: number;
    timeStart: number;
    timeEnd?: number;
    lastFrameDuration?: number;
    project: string,
    state: RenderState
    finished: boolean;
    canceled: boolean;
}

export default function RenderInfo({ id, timeStart, timeEnd, frameStart, frameEnd, currentFrame, project, state, finished, canceled, ...props }: RenderInfoProps) {
    const getCurrentProgress = (): number => {
        if (finished || canceled || !currentFrame)
            return 100;

        return  currentFrame / (frameEnd - frameStart) * 100;
    };

    return (
        <>
            <Card className="flex gap-1" {...props}>
                <CardHeader>
                    <span className="text-xl">Render {project.substring(project.lastIndexOf("\\") + 1)}</span>
                    <CardAction>
                        {getRenderState(state)}
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm">Total frames: {frameEnd - frameStart + 1}</span>
                        <span className="text-sm">Start time: {format(new Date(timeStart), "dd.MM.yyyy HH:mm:ss")}</span>
                        <span className="text-sm">Current frame: {currentFrame ?? '-'}</span>
                    </div>

                    <div className="my-3">
                        <Progress
                            value={getCurrentProgress()}
                            color={finished ? (canceled ? 'red-900': 'green-900') : 'blue-400'} />
                    </div>

                </CardContent>
                <CardFooter>
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">{project}</span>
                        <span className="text-xs text-muted-foreground">{id}</span>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}