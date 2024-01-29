import React, {PropsWithChildren, ReactNode} from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface HoverTextProps {
    content?: ReactNode;
}

export default function HoverText({children, content}: PropsWithChildren<HoverTextProps>) {
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
