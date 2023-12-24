import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {AlertTriangle} from "lucide-react";
import React, {ReactNode} from "react";

interface HoverTextProps {
    trigger: ReactNode,
    content: ReactNode
}

export default function HoverText({trigger, content}: HoverTextProps) {

    return (<TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                {trigger}
            </TooltipTrigger>
            <TooltipContent>
                {content}
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>)
}