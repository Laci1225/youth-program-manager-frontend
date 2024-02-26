import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import {useUser} from "@auth0/nextjs-auth0/client";
import {useContext} from "react";
import AccessTokenContext from "@/context/access-token-context";
import getAllRoles from "@/api/graphql/getAllRoles";
import {clientSideClient} from "@/api/graphql/client";
import PermissionContext from "@/context/permission-context";
import {LIST_PARENTS} from "@/constants/auth0-permissions";

export default function Navbar() {
    const {user, isLoading, error} = useUser()
    const {permissions} = useContext(PermissionContext)
    if (isLoading) {
        return (
            <div>Loading...</div>
        );
    }
    console.log(permissions)
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
                    {
                        permissions.includes(LIST_PARENTS) && (
                            <NavigationMenuItem className="mx-2">
                                <Link href="/parents" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Parents
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>)
                    }
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
                    <NavigationMenuItem className="mx-2 flex items-center">
                        {user?.name}
                    </NavigationMenuItem>

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
