import { useParams} from "react-router";
import {useFetcher} from "@/core/hooks/serverFetcher.ts";
import {useEffect, useState} from "react";
import type {RenderJob} from "@/core/types/types.ts";
import RenderInfo from "@/views/RenderInfo.tsx";
import {Empty, EmptyDescription, EmptyHeader, EmptyTitle} from "@/ui/Empty.tsx";
import {useServerStore} from "@/core/store/serverStore.ts";

export default function RenderInfoView() {
    const params = useParams();
    const { getRenderJob } = useFetcher();
    const [renderJob, setRenderJob] = useState<RenderJob>();
    const hostname = useServerStore();

    useEffect(() => {
        if (!params.id)
            return;

        getRenderJob(params.id)
            .then((job) => {job && setRenderJob(job)})
            .catch((err) => {alert(err)});
    }, [hostname]);

    const doneStates = ["finished", "canceled"]

    if (!renderJob)
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyTitle>404 - Not Found</EmptyTitle>
                    <EmptyDescription>
                        The page you&apos;re looking for doesn&apos;t exist.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );

    return (
        <>
            <div className="flex flex-col w-full py-6 pr-6">
                <RenderInfo key={renderJob.id}
                            id={renderJob.id}
                            finished={doneStates.includes(renderJob.state)}
                            canceled={renderJob.state === "canceled"}
                            state={renderJob.state}
                            currentFrame={renderJob.currentFrame}
                            frameEnd={renderJob.frameEnd}
                            frameStart={renderJob.frameStart}
                            timeStart={renderJob.timeStart}
                            timeEnd={renderJob.timeLastFrame}
                            project={renderJob.project} />

                <div className="flex flex-col">
                    {renderJob.frames?.map((frame) => (
                        <div key={frame.id}>
                            <span>{frame.frameNumber} - {new Date(frame.timestamp * 1000).toTimeString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}