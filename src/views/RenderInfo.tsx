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
            finished: "bg-green-900",
            canceled: "bg-red-900",
            inProgress: "bg-blue-900",
            started: "bg-blue-900",
        };

        return (
            <div className="flex flex-row gap-2 items-center">
                <Badge className={colorMap[state]} variant="outline">{state.charAt(0).toUpperCase() + state.slice(1)}</Badge>
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
                            color={finished ? (canceled ? 'red-900': 'green-900') : 'blue-400'} />
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