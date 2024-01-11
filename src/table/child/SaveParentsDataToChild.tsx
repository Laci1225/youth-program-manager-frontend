import {Button} from "@/components/ui/button";
import {Pencil} from "lucide-react";
import React from "react";

interface SaveParentsDataToChildProps {
    onEdit: () => void;
    isEditParentsModeEnabled: boolean
}

export default function SaveParentsDataToChild({
                                                   onEdit,
                                                   isEditParentsModeEnabled
                                               }: SaveParentsDataToChildProps) {
    return (
        <div className={"flex justify-between mb-5"}>
            {
                !isEditParentsModeEnabled &&
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
        </div>)
}