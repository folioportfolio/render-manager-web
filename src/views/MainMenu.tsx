import {Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
    SidebarHeader, SidebarMenu,
    SidebarMenuButton, SidebarMenuItem} from "@/ui/Sidebar.tsx";
import {useNavigate} from "react-router";
import { HomeIcon, SettingsIcon } from "lucide-react"
import {Popover, PopoverContent, PopoverTrigger} from "@/ui/Popover.tsx";
import {Button} from "@/ui/Button.tsx";
import ServerSettingsView from "@/views/ServerSettingsView.tsx";
import {useServerStore} from "@/core/store/serverStore.ts";
import {useState} from "react";
import logo from "@/assets/logo.svg";

export default function MainMenu() {
    const navigate = useNavigate();
    const [serverSettingsOpen, setServerSettingsOpen] = useState(false);
    const {hostname} = useServerStore();

    const menuItems = [
        {
            label: "Renders",
            href: "/",
            icon: HomeIcon
        }
    ];

    return (
        <>
            <Sidebar>
                <SidebarHeader>
                    <img className="my-2 h-10 self-start" src={logo} alt="Render Status Logo" />
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Application</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {menuItems.map((item) => (
                                    <SidebarMenuItem key={item.label} className="mx-2 cursor-pointer">
                                        <SidebarMenuButton onClick={() => navigate(item.href)} asChild>
                                            <div>
                                                <item.icon />
                                                <span className="pl-4">{item.label}</span>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <div className="flex flex-row items-center">
                        <span className="flex grow text-sm ml-2">{hostname}</span>
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
                </SidebarFooter>
            </Sidebar>
        </>
    );
}