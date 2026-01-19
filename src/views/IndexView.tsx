import WelcomeView from "@/views/WelcomeView.tsx";
import {SidebarProvider, SidebarTrigger} from "@/ui/Sidebar.tsx";
import {SocketEventInitializer} from "@/core/helpers/socketEventInitializer.ts";
import {BrowserRouter, Route, Routes} from "react-router";
import MainMenu from "@/views/MainMenu.tsx";
import RenderBrowserView from "@/views/RenderBrowserView.tsx";
import RenderInfoView from "@/views/RenderInfoView.tsx";
import AppKeysManagementView from "@/views/AppKeysManagementView.tsx";
import {useAuth} from "@/core/contexts/authContext.tsx";

export default function  IndexView() {
    const { user } = useAuth();

    const getAnonymousContent = () => <WelcomeView/>

    const getContent = () => (
        <>
            <SidebarProvider>
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
            </SidebarProvider>
        </>
    );

    if (user)
        return getContent();
    else
        return getAnonymousContent();
}