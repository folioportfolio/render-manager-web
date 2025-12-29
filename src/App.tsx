import { useEffect } from 'react';
import { RenderProvider } from './core/contexts/renderContext';
import { getUserData } from './core/hooks/userSettings';
import { useServerStore } from './core/store/serverStore';
import MainMenu from './views/MainMenu.tsx';
import {ThemeProvider} from "@/ui/providers/theme-provider.tsx";
import {SidebarProvider, SidebarTrigger} from "@/ui/Sidebar.tsx";
import {BrowserRouter, Route, Routes} from "react-router";
import RenderBrowserView from "@/views/RenderBrowserView.tsx";
import RenderInfoView from "@/views/RenderInfoView.tsx";

export default function App() {
    const setHostname = useServerStore((s) => s.setHostname);

    // Init storage
    useEffect(() => {
        (async () => {
            setHostname((await getUserData("hostname")) ?? import.meta.env.VITE_API_HOST);
        })();
    }, []);

    return (
        <RenderProvider>
            <SidebarProvider>
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <BrowserRouter>
                        <SidebarTrigger />
                        <MainMenu />

                        <Routes>
                            <Route index element={<RenderBrowserView />} />
                            <Route path="render/:id" element={<RenderInfoView />} />
                        </Routes>
                    </BrowserRouter>
                </ThemeProvider>
            </SidebarProvider>
        </RenderProvider>
    );
}
