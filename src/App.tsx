import { useEffect } from 'react';
import { getUserData } from './core/hooks/userSettings';
import { useServerStore } from './core/store/serverStore';
import {ThemeProvider} from "@/ui/providers/theme-provider.tsx";
import {AuthProvider} from "@/core/contexts/authContext.tsx";
import {SocketProvider} from "@/core/contexts/socketContext.tsx";
import IndexView from "@/views/IndexView.tsx";

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
                    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                        <IndexView />
                    </ThemeProvider>
            </SocketProvider>
        </AuthProvider>
    );
}
