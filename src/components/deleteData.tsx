import {toast} from "@/components/ui/use-toast";
import React, {useContext, useState} from "react";
import ConfirmDialog from "@/components/confirmDialog";
import AccessTokenContext from "@/context/AccessTokenContext";

interface DeleteDataProps<T> {
    entityId?: string,
    entityLabel: string,
    onSuccess: (deletedData: T) => void,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
    deleteFunction: (id: string, auth0: string | undefined) => Promise<T>,
    entityType: string
}

export default function DeleteData<T>({
                                          entityId,
                                          entityLabel,
                                          isOpen,
                                          onOpenChange,
                                          onSuccess,
                                          deleteFunction,
                                          entityType,
                                      }: DeleteDataProps<T>) {

    const accessToken = useContext(AccessTokenContext);
    const handleDelete = async () => {
        if (entityId) {
            try {
                const deletedData = await deleteFunction(entityId, accessToken);
                toast({
                    variant: "default",
                    title: `${entityType} data deleted successfully`,
                    description: `${entityLabel} deleted`,
                    duration: 2000
                });
                onSuccess(deletedData)
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error occurred: " + error,
                    description: `${entityType} data with name: ${entityLabel} could not be deleted`,
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
            title="Are you absolutely sure?"
            description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
            onContinue={handleDelete}
        />
    );
}
