import { useParams} from "react-router";
import {useFetcher} from "@/core/hooks/serverFetcher.ts";
import {useEffect, useState} from "react";
import type {RenderJob} from "@/core/types/types.ts";
import RenderInfo from "@/views/RenderInfo.tsx";
import {Empty, EmptyDescription, EmptyHeader, EmptyTitle} from "@/ui/Empty.tsx";
import {useServerStore} from "@/core/store/serverStore.ts";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/ui/Card.tsx";
import {type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/ui/Chart.tsx";
import {Area, AreaChart, CartesianGrid, XAxis, YAxis} from "recharts";

type ChartData = { frame: number, time: number  };

export default function RenderInfoView() {
    const params = useParams();
    const { getRenderJob } = useFetcher();

    const [renderJob, setRenderJob] = useState<RenderJob>();
    const [chartData, setChartData] = useState<ChartData[]>([]);

    const hostname = useServerStore();

    const prepareRenderJob = (job: RenderJob | null) => {
        if (!job)
            return;

        setRenderJob(job);

        if (!job.frames || !job.frames.length)
            return;

        const data: ChartData[] = [];
        let lastTime = job.timeStart;

        for (let i = 0; i < job.frames.length; i++) {

            const frame = job.frames[i];
            data.push({
                frame: frame.frameNumber,
                time: Math.floor(frame.timestamp - lastTime),
            });

            lastTime = frame.timestamp;
        }

        setChartData(data);
    };

    useEffect(() => {
        if (!params.id)
            return;

        getRenderJob(params.id)
            .then(prepareRenderJob)
            .catch((err) => {alert(err)});
    }, [hostname]);

    const doneStates = ["finished", "canceled"]

    const chartConfig = {
        time: {
            label: "Time [ms]",
            color: "var(--chart-1)",
        },
    } satisfies ChartConfig

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
            <div className="flex flex-col w-full py-6 pr-6 gap-4">
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
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Time per Frame
                            </CardTitle>
                            <CardDescription>
                                Showing render time per frame + composition time
                            </CardDescription>
                            <CardContent className="p-0">
                                <ChartContainer config={chartConfig} className="aspect-auto h-62.5 w-full mt-6">
                                    <AreaChart
                                        className="h-32"
                                        accessibilityLayer
                                        data={chartData}
                                        margin={{
                                            left: 12,
                                            right: 12,
                                        }}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="frame"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                        />

                                        <YAxis
                                            dataKey="time"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                        />
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent indicator="line" active={false} payload={[]} coordinate={undefined} accessibilityLayer={false} activeIndex={undefined} />}
                                        />


                                        <Area
                                            dataKey="time"
                                            type="natural"
                                            fill="var(--chart-2)"
                                            fillOpacity={0.4}
                                            stroke="var(--chart-2)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ChartContainer>
                            </CardContent>
                        </CardHeader>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            Render Info
                        </CardHeader>
                        <CardContent>
                            <span className="text-sm">{renderJob.frames?.slice(-1)[0]?.info}</span>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}