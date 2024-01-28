import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

export default function Navbar() {
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
                    <NavigationMenuItem className={"mx-2"} aria-disabled>
                        <Link href="http://localhost:8080/oauth2/authentication/auth0" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Login
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className={"mx-2"} aria-disabled>
                        <Link href="http://localhost:8080/register" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Register
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </div>
            </NavigationMenuList>
        </NavigationMenu>
    );
}
