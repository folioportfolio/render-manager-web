import LoginView from "@/views/LoginView.tsx";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/ui/Card.tsx";
import logo from "@/assets/logo.webp";
import {Button} from "@/ui/Button.tsx";
import {Download} from "lucide-react";
export default function WelcomeView() {
    return (
        <>
            <div className="flex w-full h-screen items-center justify-center splash-bg p-8" style={{backgroundImage: "url('/images/welcome-splash.webp')"}}>
                <Card className="bg-transparent lg:w-1/5 w-full mx-8 backdrop-blur-2xl p-8 rounded-2xl">
                    <CardHeader className="text-center text-2xl">
                        <CardTitle>
                            <div className="flex flex-col items-center justify-center">
                                <img className="my-2 h-14" src={logo} alt="Render Status Logo" />
                                Render Status
                            </div>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col h-full justify-end">
                        <div className="flex flex-col justify-end">
                           <p className="text-sm my-4">
                               Use one of the options below to log in to the portal and start tracking your renders!
                           </p>

                            <LoginView />
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button className="w-full" variant="outline">
                            <div className="flex flex-row gap-4 justify-center items-center">
                                <Download />
                                Download Blender Addon
                            </div>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}