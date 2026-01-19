import {createContext, useContext, useEffect, useState} from "react";
import {onAuthStateChanged, type User} from "firebase/auth";
import {auth} from "@/core/auth/firebase.ts";

type AuthContextType = {
    user: User | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({children} : AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}