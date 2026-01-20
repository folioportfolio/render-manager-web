import type {RenderJob} from "@/core/types/types.ts";
import {doneStates} from "@/helpers/renderStateHelper.tsx";
import {useNavigate} from "react-router";
import {Empty, EmptyDescription, EmptyHeader, EmptyTitle} from "@/ui/Empty.tsx";
import RenderInfo from "@/views/RenderInfo.tsx";

export interface RenderListProps {
    items: RenderJob[] | null
}

export default function RenderJobGrid({items} : RenderListProps) {
    const navigate = useNavigate();

    return (
        <>
            <div className="flex w-full">
                {items && items.length > 0 && (
                    <div className="flex flex-col w-full pr-6">
                        <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
                            {items.map((item) => (
                                <RenderInfo key={item.id}
                                            className="hover:bg-accent cursor-pointer"
                                            id={item.id}
                                            finished={doneStates.includes(item.state)}
                                            canceled={item.state === "canceled"}
                                            state={item.state}
                                            currentFrame={item.currentFrame}
                                            frameEnd={item.frameEnd}
                                            frameStart={item.frameStart}
                                            timeStart={item.timeStart}
                                            timeEnd={item.timeLastFrame}
                                            project={item.project}
                                            onClick={() => navigate(`/render/${item.id}`)}/>
                            ))}
                        </div>
                    </div>
                )}

                {!items || items.length === 0 && (
                    <Empty>
                        <EmptyHeader>
                            <EmptyTitle>No renders</EmptyTitle>
                            <EmptyDescription>
                                No renders are currently running. Start rendering!
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                )}
            </div>
        </>
    );
}