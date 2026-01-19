import LoginView from "@/views/LoginView.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/ui/Card.tsx";
import {useAuth} from "@/core/contexts/authContext.tsx";
export default function WelcomeView() {
    const user = useAuth();

    return (
        <>
            <div className="flex w-full h-screen items-center justify-center splash-bg p-8" style={{backgroundImage: "url('/images/welcome-splash.webp')"}}>
                <Card className="bg-transparent lg:w-1/5 w-full mx-8 backdrop-blur-2xl p-8 rounded-2xl">
                    <CardHeader className="text-center text-2xl">
                        <CardTitle>
                            Welcome to Render Status
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col h-full justify-end">
                        <div className="flex flex-col justify-end">
                            {!user?.user && <p className="text-sm my-4">
                                Use one of the options below to log in to the portal and start tracking your progress!
                            </p>}

                            <LoginView />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}