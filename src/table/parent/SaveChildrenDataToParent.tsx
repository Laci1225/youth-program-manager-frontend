import {Button} from "@/components/ui/button";
import {Pencil} from "lucide-react";
import {toast} from "@/components/ui/use-toast";
import React from "react";
import {ChildData} from "@/model/child-data";
import {ParentData, ParentDataWithChildren} from "@/model/parent-data";

interface SaveParentsDataToChildProps {
    onEdit: () => void;
    onCancel: () => void;
    isAutoCompleteShown: boolean
    parentWithChildren: ParentDataWithChildren
    updateAndSaveParent: (parent: ParentData) => void
}

export default function SaveChildrenDataToParent({
                                                     onEdit,
                                                     isAutoCompleteShown,
                                                     parentWithChildren,
                                                     onCancel,
                                                     updateAndSaveParent
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
                    //const emergencyContacts = child.relativeParents?.filter(parent => parent.isEmergencyContact);
                    //if (emergencyContacts && emergencyContacts.length === 0 && childWithoutUnnecessaryFields.relativeParents?.length !== 0) {
                    /*toast({
                        title: "Error",
                        description: "At least one parent should be marked as an emergency contact.",
                        duration: 2000,
                        variant: "destructive"
                    });*/
                    // } else {
                    updateAndSaveParent(parentWithChildren);
                    // }
                }}>
                    Save
                </Button>}
        </div>)
}