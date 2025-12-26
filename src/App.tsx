import { useEffect } from 'react';
import { RenderProvider } from './core/contexts/renderContext';
import { getUserData } from './core/hooks/userSettings';
import { useServerStore } from './core/store/serverStore';
import MainWindow from './views/MainWindow';

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
            <div>
                <MainWindow />
            </div>
        </RenderProvider>
    );
}
