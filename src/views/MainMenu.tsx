import {Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu,
    SidebarMenuButton, SidebarMenuItem} from "@/ui/Sidebar.tsx";
import {useNavigate} from "react-router";

export default function MainMenu() {
    const navigate = useNavigate();

    const menuItems = [
        {
            label: "Renders",
            href: "/"
        },
        {
            label: "Settings",
            href: "/Settings"
        },
    ];

    return (
        <>
            <Sidebar>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Application</SidebarGroupLabel>
                    </SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.label} className="mx-2 cursor-pointer">
                                    <SidebarMenuButton onClick={() => navigate(item.href)} asChild>
                                        <span className="pl-4">{item.label}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarContent>
            </Sidebar>
        </>
    );
}