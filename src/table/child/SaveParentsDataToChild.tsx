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
        <>            {
            !isEditParentsModeEnabled &&
            <div className={"flex justify-between mb-5"}>
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
            </div>
        }
        </>
    )
}