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
            display: "grid lg:grid-cols-2 sm:grid-cols-1 gap-4"
        },
        {
            title: "Finished",
            data: finishedJobs,
            display: "grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4"
        }
    ];

    // const loadMoreJobs = (info: { distanceFromEnd: number; }): void => {
    //     renderContext.loadMoreJobs();
    // }

    type PageInfo = number | "...";
    const getPages = (page: number, maxPages: number, range: number = 2): PageInfo[] => {
        const pages: number[] = [];

        for (let i = 1; i <= maxPages; i++) {
            if (i === 1 || i === maxPages || Math.abs(i - page) <= range)
                pages.push(i);
        }

        const pagesEllipsis: PageInfo[] = [];
        for (let i = 0; i < pages.length; i++) {
            pagesEllipsis.push(pages[i]);
            if (i+1 !== pages.length && Math.abs(pages[i] - pages[i+1]) > 1)
                pagesEllipsis.push("...");
        }

        return pagesEllipsis;
    }

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

                        {getPages(renderContext.currentPage, renderContext.maxPages).map((p, i) => (
                            <PaginationItem key={`${p}${i}`}>
                                {(p === "...") ?
                                    (<PaginationEllipsis />) :
                                    (<PaginationLink onClick={() => renderContext?.setCurrentPage(p)} isActive={renderContext.currentPage === p}>{p}</PaginationLink>)
                                }
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext onClick={() => renderContext?.setCurrentPage(Math.min(renderContext?.currentPage + 1, renderContext?.maxPages))} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </>
    );
}