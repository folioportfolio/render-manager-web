import { format } from "date-fns";
import { type RenderState } from "../core/types/types";
import {Progress} from "@/ui/Progress.tsx";
import {Card, CardContent, CardFooter, CardHeader} from "@/ui/Card.tsx";
import checkIcon from "@/assets/simple-check.png";
import errorIcon from "@/assets/simple-error.png";
import timeIcon from "@/assets/simple-time.png";

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

        const iconMap: IconMap = {
            finished: checkIcon,
            canceled: errorIcon,
            inProgress: timeIcon,
            started: timeIcon,
        };

        return (
            <div className="flex flex-row gap-2 items-center">
                <img className="w-5 h-5" alt="Render State Icon" src={iconMap[state]} />
                <span>{state.charAt(0).toUpperCase() + state.slice(1)}</span>
            </div>
        );
    }

    return (
        <>
            <Card className="flex gap-1">
                <CardHeader>
                    <span>Render {project.substring(project.lastIndexOf("\\") + 1)}</span>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm">Total frames: {frameEnd - frameStart + 1}</span>
                        <span className="text-sm">Start time: {format(new Date(timeStart * 1000), "dd.MM.yyyy HH:mm:ss")}</span>
                        <span className="text-sm">Current frame: {currentFrame ?? '-'}</span>
                    </div>

                    <div className="my-3">
                        {getRenderState(state)}
                        <Progress
                            value={currentFrame ?? frameEnd}
                            color={finished ? (canceled ? '#ff0000': '#00ff00') : '#0000ff'} />
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