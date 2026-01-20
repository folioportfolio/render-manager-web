import {LogOut, User} from "lucide-react";
import { FaGoogle, FaDiscord } from "react-icons/fa";
import {Button} from "@/ui/Button.tsx";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import {auth} from "@/core/auth/firebase.ts";
import {useEffect, useState} from "react";

export default function LoginView() {
    const [username, setUsername] = useState<string | null>(null);
    const googleProvider = new GoogleAuthProvider();

    useEffect(() => {
        return onAuthStateChanged(auth, login => {
            setUsername(login?.displayName ?? null);
        });
    }, [])

    const logIn = async () => {
        await signInWithPopup(auth, googleProvider);
    }

    const logOut = async () => {
        await signOut(auth);
    }

    if (username) {
        return (
            <div className="flex flex-row items-center">
                <User className="mr-2 outline rounded-md w-8 h-8 p-1" />
                <span className="flex grow">{username}</span>

                <Button variant="outline" size="icon" onClick={logOut}>
                    <LogOut />
                </Button>
            </div>
        );
    } else {
        return (
            <div className="flex flex-col gap-2">
                <Button className="flex flex-row items-center" variant="default" size="default" onClick={logIn}>
                    <FaGoogle />
                    Sign in with Google
                </Button>

                <Button className="flex flex-row items-end" variant="default" size="default" onClick={logIn}>
                    <FaDiscord />
                    Sign in with Discord
                </Button>
            </div>
        );
    }
}