import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function Custom404() {
    return (
        <div className="container items-center w-full justify-center h-[100vh] flex flex-col">
            <div className="p-4">
                <h1>404 - Page Not Found</h1>
            </div>
            <Link href="/">
                <Button>
                    Back to the main page

                </Button>
            </Link>
        </div>)
}