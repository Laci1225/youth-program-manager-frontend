import {toast} from "@/components/ui/use-toast";
import React from "react";
import deleteParent from "@/api/graphql/parent/deleteParent";
import ConfirmDialog from "@/components/conformDialog";

interface deleteParentProps {
    parent?: ParentData,
    onSuccess: (deletedParent: ParentData) => void
    isOpen: boolean
    onOpenChange: (open: boolean) => void;
}

export default function DeleteParent({parent, isOpen, onOpenChange, onSuccess}: deleteParentProps) {
    const handleDelete = async () => {
        if (parent) {
            try {
                const deletedParent = await deleteParent(parent.id);
                toast({
                    variant: "default",
                    title: "Parent data deleted successfully",
                    description: `${deletedParent.givenName} ${deletedParent.familyName} deleted`
                });
                onSuccess(deletedParent)
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error occurred: " + error,
                    description: `Parent data with name: ${parent.givenName} ${parent.familyName} could not be deleted`
                });
            }
        } else {
            toast({
                variant: "destructive",
                title: "Error occurred: parent not found",
            });
        }
    }
    return (
        <ConfirmDialog
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={"Are you absolutely sure?"}
            description={"This action cannot be undone. This will permanently delete your" +
                " account and remove your data from our servers."}
            onContinue={handleDelete}/>
    )
}