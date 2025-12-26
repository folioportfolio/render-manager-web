import { format } from "date-fns";
import { theme } from "../core/themes/themes";
import { type RenderState } from "../core/types/types";
import {Progress} from "@/ui/Progress.tsx";
import {Card} from "@/ui/Card.tsx";

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
            finished: "../assets/simple-check.png",
            canceled: "../assets/simple-error.png",
            inProgress: "../assets/simple-time.png",
            started: "../assets/simple-time.png",
        };

        return (
            <div>
                <img alt="Render State Icon" src={iconMap[state]} />
                <span>{state.charAt(0).toUpperCase() + state.slice(1)}</span>
            </div>
        );
    }

    return (
        <>
            <Card>
                <span>Render {project.substring(project.lastIndexOf("\\") + 1)}</span>
                <span>Total frames: {frameEnd - frameStart + 1}</span>
                <span>Start time: {format(new Date(timeStart * 1000), "dd.MM.yyyy HH:mm:ss")}</span>
                <span>Current frame: {currentFrame ?? '-'}</span>

                <div>
                    {getRenderState(state)}
                    <Progress
                        value={currentFrame ?? frameEnd}
                        color={finished ? (canceled ? theme.canceled : theme.done) : theme.inProgress} />
                </div>

                <span>{project}</span>
                <span>{id}</span>
            </Card>
        </>
    );
}