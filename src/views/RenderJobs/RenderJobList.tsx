import type {RenderJob} from "@/core/types/types.ts";
import {getRenderState} from "@/helpers/renderStateHelper.tsx";
import {Button} from "@/ui/Button.tsx";
import {Eye} from "lucide-react";
import {useNavigate} from "react-router";
import {Empty, EmptyDescription, EmptyHeader, EmptyTitle} from "@/ui/Empty.tsx";
import type {CSSProperties} from "react";
import {formatDistanceToNow, formatDuration, intervalToDuration} from "date-fns";
import {useIsMobile} from "@/hooks/useMobile.ts";

export interface RenderListProps {
    items: RenderJob[] | null
}

interface TableColumnDefinition {
    header: string | (() => React.ReactNode);
    cell: string | ((item: RenderJob) => React.ReactNode);
    size?: string;
    hideOnMobile?: boolean;
}

const columnDefinition: TableColumnDefinition[] = [
    {
        header: "Status",
        cell: (item) => {
            return getRenderState(item.state);
        },
        size: "100px"
    },
    {
        header: "Title",
        cell: (item) => {
            const value = item.project;
            return(
                <div className="flex flex-col w-full">
                    <span className="font-bold">{value.substring(value.lastIndexOf("\\") + 1, value.lastIndexOf("."))}</span>
                    <span className="text-xs text-muted-foreground">{value}</span>
                </div>
            );
        },
        size: "3fr"
    },
    {
        header: () => <div>Frames</div>,
        cell: (item) => {
            return (<div>{item.framesRendered}</div>);
        },
        hideOnMobile: true
    },
    {
        header: "Start Time",
        cell: (item) => {
            return (
                <div className="text-xs" title={new Date(item.timeStart).toLocaleString()}>
                    {formatDistanceToNow(new Date(item.timeStart), {addSuffix: true})}
                </div>)
        },
        hideOnMobile: true
    },
    {
        header: "End Time",
        cell: (item) => {
            return (
                <div className="text-xs" title={item.timeEnd ? new Date(item.timeEnd).toLocaleString() : undefined}>
                    {item.timeEnd ? formatDistanceToNow(new Date(item.timeEnd), {addSuffix: true}) : ""}
                </div>)
        },
        hideOnMobile: true
    },
    {
        header: "Total Time",
        cell: (item) => {
            const timeStart = item.timeStart;
            const timeEnd = item.timeEnd ? item.timeEnd : timeStart;
            return (<div className="text-xs">{formatDuration(intervalToDuration({start: timeStart, end: timeEnd}), {format: ["hours", "minutes", "seconds"]})}</div>)
        },
        hideOnMobile: true
    },
    {
        header: "Resolution",
        cell: (item) => {
            return(<div className="text-xs">{item.resolutionX} × {item.resolutionY}</div>);
        },
        hideOnMobile: true
    },
    {
        header: "Engine",
        cell: (item) => {
            return(<div className="text-xs">{item.engine}</div>);
        },
        hideOnMobile: true
    },
    {
        header: "Software",
        cell: (item) => {
            return(
                <div className="flex flex-col w-full">
                    <span className="font-bold">{item.software}</span>
                    <span className="text-xs text-muted-foreground">{item.version}</span>
                </div>
            );
        },
        hideOnMobile: true
    },
    {
        header: "",
        cell: () => <Button variant="outline" size="icon"><Eye /></Button>,
        size: "80px"
    }
]

export default function RenderJobList({items} : RenderListProps) {
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const getGridDefinition = (): CSSProperties => {
        let def = "";
        for (const column of columnDefinition) {
            if (column.hideOnMobile && isMobile)
                continue;

            def += column.size ?? "1fr";
            def += " ";
        }

        return {
            gridTemplateColumns: def
        }
    }

    if (!items || items.length === 0) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyTitle>No renders</EmptyTitle>
                    <EmptyDescription>
                        You have no renders to show. Start rendering!
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    return (
        <>
            <div className="flex flex-col bg-background border rounded-md min-h-0">
                <div className="grid w-full border-b" style={ getGridDefinition() }>
                    {columnDefinition.map((item) => {
                        if (item.hideOnMobile && isMobile)
                            return null;

                        const headerContent = typeof item.header === "string" ? <div>{item.header}</div> :
                            typeof item.header === "function" ?  item.header() as React.ReactNode : "";

                        return (
                            <div className="p-4 font-bold">
                                {headerContent}
                            </div>
                        );
                    })}
                </div>

                <div className="flex flex-col overflow-y-auto">
                    {items.map((item) => {
                        return (
                            <div className="grid w-full hover:bg-accent cursor-pointer" style={ getGridDefinition() } onClick={() => navigate(`/render/${item.id}`)}>
                                {columnDefinition.map((def) => {
                                    if (def.hideOnMobile && isMobile)
                                        return null;

                                    const cellContent = def.cell instanceof String ? <div>{def.cell}</div> :
                                        typeof def.cell === "function" ?  def.cell(item) as React.ReactNode : "";

                                    return (
                                        <div className="flex px-4 py-2 items-center">
                                            {cellContent}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}