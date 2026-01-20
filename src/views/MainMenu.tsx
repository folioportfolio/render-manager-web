import {Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
    SidebarHeader, SidebarMenu,
    SidebarMenuButton, SidebarMenuItem} from "@/ui/Sidebar.tsx";
import {useNavigate} from "react-router";
import { HomeIcon, Computer } from "lucide-react"
import logo from "@/assets/logo.webp";
import LoginView from "@/views/LoginView.tsx";
import ServerManagementView from "@/views/ServerManagementView.tsx";

export default function MainMenu() {
    const navigate = useNavigate();

    const menuItems = [
        {
            label: "Renders",
            href: "/",
            icon: HomeIcon
        },
        {
            label: "App Keys",
            href: "/settings/appkeys",
            icon: Computer
        }
    ];

    return (
        <>
            <Sidebar>
                <SidebarHeader>
                    <div className="flex flex-row items-center gap-4">
                        <img className="my-2 h-10 self-start" src={logo} alt="Render Status Logo" />
                        <span className="text-2xl font-logo">Render Status</span>
                    </div>
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
                    <div className="flex flex-col pl-2 gap-2">
                        <LoginView />
                        <hr/>
                        <ServerManagementView />
                    </div>
                </SidebarFooter>
            </Sidebar>
        </>
    );
}