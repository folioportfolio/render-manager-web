import { format } from "date-fns";
import { type RenderState } from "../core/types/types";
import {Progress} from "@/ui/Progress.tsx";
import {Card, CardAction, CardContent, CardFooter, CardHeader} from "@/ui/Card.tsx";
import {Badge} from "@/ui/Badge.tsx";

export interface RenderInfoProps {
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

export default function RenderInfo({ id, timeStart, frameStart, frameEnd, currentFrame, project, state, finished, canceled }: RenderInfoProps) {

    const getRenderState = (state: RenderState): React.ReactNode => {
        type IconMap = { [K in RenderState]: any }

        const colorMap: IconMap = {
            finished: "green-400",
            canceled: "red-400",
            inProgress: "blue-400",
            started: "green-400",
        };

        return (
            <div className="flex flex-row gap-2 items-center">
                <Badge className={`bg-${colorMap[state]}`}>{state.charAt(0).toUpperCase() + state.slice(1)}</Badge>
            </div>
        );
    }

    return (
        <>
            <Card className="flex gap-1 hover:bg-accent">
                <CardHeader>
                    <span>Render {project.substring(project.lastIndexOf("\\") + 1)}</span>
                    <CardAction>
                        {getRenderState(state)}
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm">Total frames: {frameEnd - frameStart + 1}</span>
                        <span className="text-sm">Start time: {format(new Date(timeStart * 1000), "dd.MM.yyyy HH:mm:ss")}</span>
                        <span className="text-sm">Current frame: {currentFrame ?? '-'}</span>
                    </div>

                    <div className="my-3">
                        <Progress
                            value={currentFrame ?? frameEnd}
                            color={finished ? (canceled ? 'red-400': 'green-400') : 'blue-400'} />
                    </div>

                    <span>{project}</span>
                </CardContent>
                <CardFooter>
                    <span className="text-xs text-muted-foreground">{id}</span>
                </CardFooter>
            </Card>
        </>
    );
}