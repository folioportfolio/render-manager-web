import {Button} from "@/ui/Button.tsx";
import {useFetcher} from "@/core/hooks/useFetcher.ts";
import {useEffect, useState} from "react";
import type {AppKey} from "@/core/types/types.ts";
import {Input} from "@/ui/Input.tsx";
import {Trash2} from "lucide-react";
import {Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle} from "@/ui/Card.tsx";

export default function AppKeysManagementView() {
    const { getAppKeys, createAppKey, deleteAppKey } = useFetcher();
    const [keys, setKeys] = useState<AppKey[]>([]);

    useEffect(() => {
        getAppKeys().then(x => {
            if (!x)
                return;

            setKeys(x);
        });
    }, [])

    const createKey = async () => {
        const key = await createAppKey();

        if (!key)
            return;

        setKeys(prev => prev.concat(key));
    }

    const deleteKey = async (key: string) => {
        const success = await deleteAppKey(key);

        if (!success)
            return;

        setKeys(prev => {
            return prev.filter(x => x.apiKey !== key);
        });
    }

    return (
        <>
            <div className="flex flex-col items-center justify-start splash-bg py-4 pr-4 w-full">
                <Card className="lg:w-1/2 w-full mx-4">
                    <CardHeader>
                        <CardTitle>
                            Manage App Keys
                        </CardTitle>

                        <CardAction>
                            <Button className="self-start" variant="default" size="default" onClick={createKey}>
                                Create App Key
                            </Button>
                        </CardAction>

                        <CardDescription>
                            Here you can add/remove your App Keys. Copy your App Key into the Blender extension to connect it to your account. Do not share the App Key with anyone.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="flex flex-col gap-2">
                            {keys && keys.map(key => (
                                <div key={key.apiKey} className="flex flex-row gap-2">
                                    <Input key={key.apiKey} value={key.apiKey} className="w-full" readOnly />
                                    <Button variant="outline" size="icon" onClick={() => deleteKey(key.apiKey)}>
                                        <Trash2 />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}