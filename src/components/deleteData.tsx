import {toast} from "@/components/ui/use-toast";
import React from "react";
import ConfirmDialog from "@/components/confirmDialog";

interface PersonData {
    id: string;
    givenName: string;
    familyName: string;
}

interface DeleteDataProps<T> {
    data?: T,
    onSuccess: (deletedData: T) => void,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
    deleteFunction: (id: string) => Promise<T>,
    dataType: string
}

export default function DeleteData<T extends PersonData>({
                                                             data,
                                                             isOpen,
                                                             onOpenChange,
                                                             onSuccess,
                                                             deleteFunction,
                                                             dataType
                                                         }: DeleteDataProps<T>) {
    const handleDelete = async () => {
        if (data) {
            try {
                const deletedData = await deleteFunction(data.id);
                toast({
                    variant: "default",
                    title: `${dataType} data deleted successfully`,
                    description: `${deletedData.givenName} ${deletedData.familyName} deleted`,
                    duration: 2000
                });
                onSuccess(deletedData)
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error occurred: " + error,
                    description: `${dataType} data with name: ${data.givenName} ${data.familyName} could not be deleted`,
                    duration: 2000
                });
            }
        } else {
            toast({
                variant: "destructive",
                title: "Error occurred: data not found",
                duration: 2000
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
            onContinue={handleDelete}
        />
    );
}
