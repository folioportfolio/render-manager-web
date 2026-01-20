import type {RenderState} from "@/core/types/types.ts";
import {Badge} from "@/ui/Badge.tsx";

export const runningStates = ["inProgress", "started"];
export const doneStates = ["finished", "canceled"]

export const getRenderState = (state: RenderState): React.ReactNode => {
    type IconMap = { [K in RenderState]: any }

    const colorMap: IconMap = {
        finished: "bg-green-900",
        canceled: "bg-red-900",
        inProgress: "bg-blue-400",
        started: "bg-blue-900",
    };

    return (
        <div className="flex flex-row gap-2 items-center">
            <Badge className={colorMap[state]} variant="outline">{state.charAt(0).toUpperCase() + state.slice(1)}</Badge>
        </div>
    );
}