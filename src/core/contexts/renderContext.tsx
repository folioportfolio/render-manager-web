import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { useFetcher } from "../hooks/serverFetcher";
import { type RenderJob, type RenderState } from "../types/types";
import { useServerStore } from "../store/serverStore";

interface RenderContextValue {
    jobs: Map<string, RenderJob>;
    setJobs: React.Dispatch<React.SetStateAction<Map<string, RenderJob>>>;
    refresh: () => Promise<void>;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    maxPages: number;
}

interface RenderProviderProps {
    children: ReactNode;
}

export const RenderContext = createContext<RenderContextValue | null>(null);

export const RenderProvider = ({ children }: RenderProviderProps) => {
    const [jobs, setJobs] = useState<Map<string, RenderJob>>(new Map());
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPages, setMaxPages] = useState(1);
    const hostname = useServerStore((s) => s.hostname);
    const { getRenderJobs, getSocket } = useFetcher();

    const loadJobs = async () => {
        try {
            const map = new Map<string, RenderJob>();
            const jobs = await getRenderJobs(currentPage);

            if (jobs) {
                jobs.items?.forEach((element) => {
                    map.set(element.id, element);
                });

                setMaxPages(Math.ceil(jobs.totalCount / import.meta.env.VITE_DEFAULT_COUNT));
            }

            setJobs(map);
        } catch (error) {
            console.log(error);
            setJobs(new Map());
        }
    };

    const refresh = async () => {
        await loadJobs();
    };

    const onRenderStart = (data: { jobId: string; job: RenderJob }) => {
        console.log(`Render start - ${JSON.stringify(data)}`);
        setJobs((prev) => {
            const next = new Map(prev);
            next.set(data.jobId, data.job);
            return next;
        });
    };

    const onFrameUpdate = (data: { jobId: string; frame: number }) => {
        console.log(`Render frame - ${JSON.stringify(data)}`);
        setJobs((prev) => {
            const next = new Map(prev);
            const job = next.get(data.jobId);

            if (job) {
                next.set(data.jobId, {
                    ...job,
                    currentFrame: data.frame,
                    timeLastFrame: Date.now() / 1000,
                    state: "inProgress",
                });
            }

            return next;
        });
    };

    const onRenderEnd = (data: { jobId: string; state: RenderState }) => {
        console.log(`Render end - ${JSON.stringify(data)}`);
        setJobs((prev) => {
            const next = new Map(prev);
            const job = next.get(data.jobId);

            if (job) {
                next.set(data.jobId, {
                    ...job,
                    state: data.state,
                });
            }

            return next;
        });
    };

    useEffect(() => {
        const socket = getSocket();

        if (!socket)
            return;

        socket.on("render-start", onRenderStart);
        socket.on("frame-update", onFrameUpdate);
        socket.on("render-end", onRenderEnd);

        return () => {
            socket?.off("render-start");
            socket?.off("frame-update");
            socket?.off("render-end");
        };
    }, [getSocket, hostname]);

    useEffect(() => {
        setCurrentPage(1);
        setMaxPages(1);
        refresh();
    }, [hostname]);

    useEffect(() => {
        refresh();
    }, [currentPage]);

    return (
        <RenderContext.Provider value={{ jobs, setJobs, refresh, currentPage, setCurrentPage, maxPages }}>
            {children}
        </RenderContext.Provider>
    );
};

export function useRenderJobs() {
    return useContext(RenderContext);
}
