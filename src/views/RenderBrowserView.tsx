import { useMemo } from "react";
import { useRenderJobs } from "../core/contexts/renderContext";
import { type RenderJob } from "../core/types/types";
import RenderInfo from "@/views/RenderInfo.tsx";
import {Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink,
    PaginationNext, PaginationPrevious} from "@/ui/Pagination.tsx";

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
            data: inProgressJobs,
            display: "grid md:grid-cols-2 sm:grid-cols-1 gap-4"
        },
        {
            title: "Finished",
            data: finishedJobs,
            display: "grid md:grid-cols-4 sm:grid-cols-1 gap-4"
        }
    ];

    // const loadMoreJobs = (info: { distanceFromEnd: number; }): void => {
    //     renderContext.loadMoreJobs();
    // }

    return (
        <>
            <div className="flex flex-col w-full">
                <div className="flex-1 pr-6">
                    {items.filter(x => x.data.length > 0).map((section) => (
                        <div key={section.title}>
                            <h1 className="my-4 text-4xl">{section.title}</h1>

                            <div className={section.display}>
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

                <Pagination className="my-3">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious onClick={() => renderContext?.setCurrentPage(Math.max(renderContext?.currentPage - 1, 1))} />
                        </PaginationItem>

                        {[...Array(Math.min(renderContext.maxPages, 3)).keys()].map((_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink onClick={() => renderContext?.setCurrentPage(i + 1)} isActive={renderContext.currentPage === i + 1}>{i + 1}</PaginationLink>
                            </PaginationItem>
                        ))}

                        {renderContext.maxPages > 4 && (
                            <PaginationItem key={renderContext.maxPages}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}

                        {renderContext.maxPages > 3 && (
                            <>
                                <PaginationItem key={renderContext.maxPages}>
                                    <PaginationLink onClick={() => renderContext?.setCurrentPage(renderContext.maxPages)}>{renderContext.maxPages}</PaginationLink>
                                </PaginationItem>
                            </>
                        )}

                        <PaginationItem>
                            <PaginationNext onClick={() => renderContext?.setCurrentPage(Math.min(renderContext?.currentPage + 1, renderContext?.maxPages))} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </>
    );
}