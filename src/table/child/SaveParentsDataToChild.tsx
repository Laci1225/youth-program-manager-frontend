import {Button} from "@/components/ui/button";
import {Pencil} from "lucide-react";
import {toast} from "@/components/ui/use-toast";
import React from "react";
import {ChildData} from "@/model/child-data";

interface SaveParentsDataToChildProps {
    onEdit: () => void;
    onCancel: () => void;
    isAutoCompleteShown: boolean
    child: ChildData
    updateAndSaveChild: (child: Omit<ChildData, "hasRegularMedicines" | "modifiedDate" | "createdDate" | "hasDiagnosedDiseases">) => void
}

export default function SaveParentsDataToChild({
                                                   onEdit,
                                                   isAutoCompleteShown,
                                                   child,
                                                   onCancel,
                                                   updateAndSaveChild
                                               }: SaveParentsDataToChildProps) {
    return (
        <div className={"flex justify-between mb-5"}>
            {
                isAutoCompleteShown ?
                    <Button
                        type={"button"}
                        variant={"ghost"}
                        onClick={onCancel}
                    >
                        <span>Cancel</span>
                    </Button>
                    :
                    <Button
                        type={"button"}
                        variant={"ghost"}
                        onClick={onEdit}
                    >
                        <>
                            <Pencil/>
                            <span>Edit parents</span>
                        </>
                    </Button>
            }
            {isAutoCompleteShown &&
                <Button onClick={() => {
                    const {
                        hasDiagnosedDiseases,
                        hasRegularMedicines,
                        createdDate,
                        modifiedDate,
                        ...childWithoutUnnecessaryFields
                    } = child;
                    const emergencyContacts = child.relativeParents?.filter(parent => parent.isEmergencyContact);
                    if (emergencyContacts && emergencyContacts.length === 0 && childWithoutUnnecessaryFields.relativeParents?.length !== 0) {
                        toast({
                            title: "Error",
                            description: "At least one parent should be marked as an emergency contact.",
                            duration: 2000,
                            variant: "destructive"
                        });
                    } else {
                        updateAndSaveChild(childWithoutUnnecessaryFields);
                    }
                }}>
                    Save
                </Button>}
        </div>)
}