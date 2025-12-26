import RenderBrowserView from "./RenderBrowserView.tsx";
import {NavigationMenu, NavigationMenuContent, NavigationMenuItem,
    NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger} from "@/ui/NavigationMenu.tsx";

export default function MainWindow() {

    return (
        <>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink>Renders</NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink>Settings</NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <RenderBrowserView />
        </>
    );
}