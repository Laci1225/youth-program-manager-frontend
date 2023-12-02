import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import React, {ReactNode} from "react";

interface ConformDialogProps {
    buttonName: string | ReactNode
    dialogTitle: string
    dialogDescription: string
    onClickAction: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>
}

export default function ConformDialog({buttonName, dialogTitle, dialogDescription, onClickAction}: ConformDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button type={"button"} variant={"destructive"}>
                    {buttonName}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {dialogTitle}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {dialogDescription}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onClickAction}>Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}