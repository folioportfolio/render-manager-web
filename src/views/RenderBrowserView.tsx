import { useMemo } from "react";
import { useRenderJobs } from "../core/contexts/renderContext";
import { type RenderJob } from "../core/types/types";
import RenderInfo from "@/views/RenderInfo.tsx";

export default function RenderBrowserView() {
    const renderContext = useRenderJobs();

    if (!renderContext)
        return null;

    const allJobs = useMemo(() => {
        return Array.from(renderContext.jobs.values()).sort((a, b) =>
            b.timeStart - a.timeStart
        );
    }, [renderContext.jobs]);

    const runningStates = ["inProgress", "started"];
    const doneStates = ["finished", "canceled"]

    const inProgressJobs: RenderJob[] = allJobs.filter(x => runningStates.includes(x.state));
    const finishedJobs: RenderJob[] = allJobs.filter(x => doneStates.includes(x.state));

    const items = [
        {
            title: "In Progress",
            data: inProgressJobs
        },
        {
            title: "Finished",
            data: finishedJobs
        }
    ];

    // const loadMoreJobs = (info: { distanceFromEnd: number; }): void => {
    //     renderContext.loadMoreJobs();
    // }

    return (
        <>
            <div className="w-full pr-6">
                {items.filter(x => x.data.length > 0).map((section) => (
                    <div key={section.title}>
                        <h1 className="my-4 text-4xl">{section.title}</h1>

                        <div className="grid grid-cols-4 gap-4">
                            {section.data.map((item) => (
                                <RenderInfo key={item.id}
                                            id={item.id}
                                            finished={doneStates.includes(item.state)}
                                            canceled={item.state === "canceled"}
                                            state={item.state}
                                            currentFrame={item.currentFrame}
                                            frameEnd={item.frameEnd}
                                            frameStart={item.frameStart}
                                            timeStart={item.timeStart}
                                            timeEnd={item.timeLastFrame}
                                            project={item.project} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}