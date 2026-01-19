import {Button} from "@/ui/Button.tsx";
import {useFetcher} from "@/core/hooks/useFetcher.ts";
import {useEffect, useState} from "react";
import type {AppKey} from "@/core/types/types.ts";
import {Input} from "@/ui/Input.tsx";

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
            <div className="flex flex-col gap-2 p-4">
                <Button variant="default" size="default" onClick={createKey}>
                    Create App Key
                </Button>

                <div className="flex flex-col gap-2">
                    {keys && keys.map(key => (
                        <div key={key.apiKey} className="flex flex-row gap-2">
                            <Input key={key.apiKey} value={key.apiKey} className="w-64" readOnly />
                            <Button variant="outline" size="icon" onClick={() => deleteKey(key.apiKey)}>X</Button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}