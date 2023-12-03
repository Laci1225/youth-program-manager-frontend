import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";

interface ConformDialogProps {
    dialogTitle: string
    dialogDescription: string
    onClickAction: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>
    isOpen: boolean
    onOpenChange: (open: boolean) => void;
}

export default function ConformDialog({isOpen, onOpenChange, dialogTitle, dialogDescription, onClickAction}: ConformDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
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