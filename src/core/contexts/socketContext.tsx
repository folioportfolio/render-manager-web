import {createContext, useContext, useEffect, useState} from "react";
import  {io, type Socket } from "socket.io-client";
import {useAuth} from "@/core/contexts/authContext.tsx";
import {useServerStore} from "@/core/store/serverStore.ts";
import {auth} from "@/core/auth/firebase.ts";

export const SocketContext = createContext<Socket | null>(null);

export interface SocketProviderProps {
    children: React.ReactNode;
}

export const SocketProvider = ({children} : SocketProviderProps) => {
    const { user, loading } = useAuth();
    const hostname = useServerStore(s => s.hostname);
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!hostname || !user || loading)
            return;

        let cancelled = false;

        (async () => {
            const token = await auth.currentUser?.getIdToken();
            if (!token || cancelled) return;

            console.log(`Creating socket`);
            const socket = io(hostname, {
                auth: { token },
            });

            socket.onAny((event, ...args) => {
                console.log("Socket event received:", event, args);
            });

            setSocket(socket);
        })();

        return () => {
            cancelled = true;
            setSocket(prev => {
                prev?.disconnect();
                return null;
            });
            console.log(`Disposing socket`);
        };
    }, [hostname, user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    return useContext(SocketContext);
}