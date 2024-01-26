import React, {ReactNode} from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface HoverTextProps {
    content?: ReactNode;
    children: ReactNode;
}

export default function HoverText({children, content}: HoverTextProps) {
    return (
        <>
            {content ? (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>{children}</TooltipTrigger>
                        <TooltipContent>{content}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ) : (
                children
            )}
        </>
    );
}
