import React from "react";

import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";

interface SubmitButtonProps {
    isLoading: boolean;
}

function SubmitButton({isLoading}: SubmitButtonProps) {

    return <Button type="submit" disabled={isLoading}>{isLoading ?
        <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : ""}Create</Button>
}

export default SubmitButton;