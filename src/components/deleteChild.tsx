import {ChildData} from "@/model/child-data";
import deleteChild from "@/api/graphql/deleteChild";
import {toast} from "@/components/ui/use-toast";
import React from "react";
import ConfirmDialog from "@/components/confirmDialog";

interface deleteChildProps {
    child?: ChildData,
    onSuccess: (deletedChild: ChildData) => void
    isOpen: boolean
    onOpenChange: (open: boolean) => void;
}

export default function DeleteChild({child, isOpen, onOpenChange, onSuccess}: deleteChildProps) {
    const handleDelete = async () => {
        if (child) {
            try {
                const deletedChild = await deleteChild(child.id);
                toast({
                    variant: "default",
                    title: "Child data deleted successfully",
                    description: `${deletedChild.givenName} ${deletedChild.familyName} deleted`
                });
                onSuccess(deletedChild)
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error occurred: " + error,
                    description: `Child data with name: ${child.givenName} ${child.familyName} could not be deleted`
                });
            }
        } else {
            toast({
                variant: "destructive",
                title: "Error occurred: child not found",
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
