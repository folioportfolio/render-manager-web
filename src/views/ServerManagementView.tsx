import {Popover, PopoverContent, PopoverTrigger} from "@/ui/Popover.tsx";
import {Button} from "@/ui/Button.tsx";
import ServerSettingsView from "@/views/ServerSettingsView.tsx";
import {SettingsIcon} from "lucide-react";
import {useState} from "react";
import {useServerStore} from "@/core/store/serverStore.ts";

export default function ServerManagementView() {
    const [serverSettingsOpen, setServerSettingsOpen] = useState(false);
    const {hostname} = useServerStore();

    return (
        <div className="flex flex-row items-center">
            <span className="flex grow text-sm">{hostname}</span>
            <Popover open={serverSettingsOpen} onOpenChange={setServerSettingsOpen}>
                <PopoverTrigger className="flex self-end" asChild>
                    <Button variant="outline" size="icon" >
                        <SettingsIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <ServerSettingsView onCancel={() => setServerSettingsOpen(false)}
                                        onSaved={() => setServerSettingsOpen(false)} />
                </PopoverContent>
            </Popover>
        </div>
    );
}