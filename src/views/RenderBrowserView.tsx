import {useEffect, useMemo } from "react";
import { type RenderJob } from "../core/types/types";
import RenderInfo from "@/views/RenderInfo.tsx";
import {Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink,
    PaginationNext, PaginationPrevious} from "@/ui/Pagination.tsx";
import {useNavigate} from "react-router";
import {useRenderJobsStore} from "@/core/store/renderJobsStore.ts";
import {useFetcher} from "@/core/hooks/useFetcher.ts";
import {useServerStore} from "@/core/store/serverStore.ts";
import {useAuth} from "@/core/contexts/authContext.tsx";

export default function RenderBrowserView() {
    const jobs = useRenderJobsStore(s => s.jobs);
    const currentPage = useRenderJobsStore(s => s.currentPage);
    const maxPages = useRenderJobsStore(s => s.maxPages);
    const setJobs = useRenderJobsStore(s => s.setJobsFromApi);
    const setCurrentPage = useRenderJobsStore(s => s.setPage);
    const hostname = useServerStore(s => s.hostname);
    const user = useAuth();

    const { getRenderJobs } = useFetcher();
    const navigate = useNavigate();

    const allJobs = useMemo(() => {
        return Array.from(jobs.values()).sort((a, b) =>
            b.timeStart - a.timeStart
        );
    }, [jobs]);

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

    useEffect(() => {
        getRenderJobs(currentPage)
            .then(res => setJobs(res.items, res.totalCount))
            .catch(err => console.log(err));
    }, [currentPage, hostname, user]);

    return (
        <>
            <div className="flex flex-col w-full">
                <div className="flex-1 pr-6">
                    {items.filter(x => x.data.length > 0).map((section) => (
                        <div key={section.title}>
                            <h1 className="my-8 text-4xl">{section.title}</h1>

                            <div className={section.display}>
                                {section.data.map((item) => (
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
                    ))}
                </div>

                <Pagination className="my-3">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} />
                        </PaginationItem>

                        {getPages(currentPage, maxPages).map((p, i) => (
                            <PaginationItem key={`${p}${i}`}>
                                {(p === "...") ?
                                    (<PaginationEllipsis />) :
                                    (<PaginationLink onClick={() => setCurrentPage(p)} isActive={currentPage === p}>{p}</PaginationLink>)
                                }
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext onClick={() => setCurrentPage(Math.min(currentPage + 1, maxPages))} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </>
    );
}