import React from "react";

import {Button, ButtonProps} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {ChildData} from "@/model/child-data";

interface LoadingButtonProps extends ButtonProps {
    isLoading: boolean;
    existingChild: ChildData | undefined;
}

function LoadingButton({isLoading, existingChild, ...props}: LoadingButtonProps) {

    return <Button {...props} disabled={isLoading}>
        {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
        ) : (
            existingChild ? "Update" : "Create"
        )}
    </Button>
}

export default LoadingButton;