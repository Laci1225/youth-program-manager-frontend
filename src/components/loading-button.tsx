import React from "react";

import {Button, ButtonProps} from "@/components/ui/button";
import {Loader2} from "lucide-react";

interface LoadingButtonProps extends ButtonProps {
    isLoading: boolean;
}

function LoadingButton({isLoading, ...props}: LoadingButtonProps) {

    return (
        <Button {...props} disabled={isLoading} type="submit">
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                    {props.children}
                </>
            ) : (
                props.children
            )}
        </Button>
    );

}

export default LoadingButton;