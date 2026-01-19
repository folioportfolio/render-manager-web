import { useEffect } from 'react';
import { getUserData } from './core/hooks/userSettings';
import { useServerStore } from './core/store/serverStore';
import MainMenu from './views/MainMenu.tsx';
import {ThemeProvider} from "@/ui/providers/theme-provider.tsx";
import {SidebarProvider, SidebarTrigger} from "@/ui/Sidebar.tsx";
import {BrowserRouter, Route, Routes} from "react-router";
import RenderBrowserView from "@/views/RenderBrowserView.tsx";
import RenderInfoView from "@/views/RenderInfoView.tsx";
import AppKeysManagementView from "@/views/AppKeysManagementView.tsx";
import {AuthProvider} from "@/core/contexts/authContext.tsx";
import {SocketProvider} from "@/core/contexts/socketContext.tsx";
import {SocketEventInitializer} from "@/core/helpers/socketEventInitializer.ts";

export default function App() {
    const setHostname = useServerStore((s) => s.setHostname);

    // Init storage
    useEffect(() => {
        (async () => {
            setHostname((await getUserData("hostname")) ?? import.meta.env.VITE_API_HOST);
        })();
    }, []);

    return (
        <AuthProvider>
            <SocketProvider>
                <SidebarProvider>
                    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                        <SocketEventInitializer />
                        <BrowserRouter>
                            <SidebarTrigger />
                            <MainMenu />

                            <Routes>
                                <Route index element={<RenderBrowserView />} />
                                <Route path="render/:id" element={<RenderInfoView />} />
                                <Route path="settings/appkeys" element={<AppKeysManagementView />} />
                            </Routes>
                        </BrowserRouter>
                    </ThemeProvider>
                </SidebarProvider>
            </SocketProvider>
        </AuthProvider>
    );
}
