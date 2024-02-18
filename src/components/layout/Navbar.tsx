import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import {useUser} from "@auth0/nextjs-auth0/client";

export default function Navbar() {
    const {user, isLoading, error} = useUser()
    if (isLoading) {
        return (
            <div>Loading...</div>
        );
    }
    return (
        <NavigationMenu
            className={`p-2 w-[100%] bg-blue-200 fixed`}>
            <NavigationMenuList className={"flex w-[98vw] justify-between"}>
                <div className={"flex"}>
                    <NavigationMenuItem className="mx-2">
                        <Link href="/children" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Children
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="mx-2">
                        <Link href="/parents" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Parents
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="mx-2">
                        <Link href="/tickets" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Tickets
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="mx-2">
                        <Link href="/ticket-types" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Ticket types
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </div>
                <div className={"flex"}>
                    {user ? (
                        <NavigationMenuItem className={"mx-2"} aria-disabled>
                            <Link href="/api/auth/logout" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Logout
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    ) : (
                        <NavigationMenuItem className={"mx-2"} aria-disabled>
                            <Link href="/api/auth/login" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Login
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    )}
                </div>
            </NavigationMenuList>
        </NavigationMenu>
    );
}
