import {useEffect, useMemo } from "react";
import { type RenderJob } from "../core/types/types";
import {Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink,
    PaginationNext, PaginationPrevious} from "@/ui/Pagination.tsx";
import {useRenderJobsStore} from "@/core/store/renderJobsStore.ts";
import {useFetcher} from "@/core/hooks/useFetcher.ts";
import {useServerStore} from "@/core/store/serverStore.ts";
import {useAuth} from "@/core/contexts/authContext.tsx";
import RenderJobList from "@/views/RenderJobs/RenderJobList.tsx";
import RenderJobGrid from "@/views/RenderJobs/RenderJobGrid.tsx";
import {doneStates, runningStates} from "@/helpers/renderStateHelper.tsx";

export default function RenderBrowserView() {
    const jobs = useRenderJobsStore(s => s.jobs);
    const currentPage = useRenderJobsStore(s => s.currentPage);
    const maxPages = useRenderJobsStore(s => s.maxPages);
    const setJobs = useRenderJobsStore(s => s.setJobsFromApi);
    const setCurrentPage = useRenderJobsStore(s => s.setPage);
    const hostname = useServerStore(s => s.hostname);
    const user = useAuth();

    const { getRenderJobs } = useFetcher();

    const allJobs = useMemo(() => {
        return Array.from(jobs.values()).sort((a, b) =>
            b.timeStart - a.timeStart
        );
    }, [jobs]);

    const inProgressJobs: RenderJob[] = allJobs.filter(x => runningStates.includes(x.state));
    const finishedJobs: RenderJob[] = allJobs.filter(x => doneStates.includes(x.state));

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
            <div className="grid grid-rows-3 w-full h-screen" style={{gridTemplateRows: "1fr 3fr auto"}}>
                <section className="flex flex-col pr-4 w-full">
                    <h1 className="my-8 text-4xl items-stretch font-logo">In Progress</h1>
                    <RenderJobGrid items={inProgressJobs}/>
                </section>

                <section className="flex flex-col pr-4 w-full min-h-0">
                    <h1 className="my-8 text-4xl items-stretch font-logo">Completed</h1>
                    <RenderJobList items={finishedJobs}/>
                </section>

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