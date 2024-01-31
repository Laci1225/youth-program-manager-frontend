import {Button} from "@/components/ui/button";
import {Pencil} from "lucide-react";
import React from "react";

interface SaveParentsDataToChildProps {
    onEdit: () => void;
    isEditChildrenModeEnabled: boolean
}

export default function SaveChildrenDataToParent({
                                                     onEdit,
                                                     isEditChildrenModeEnabled
                                                 }: SaveParentsDataToChildProps) {
    return (
        <>
            {
                !isEditChildrenModeEnabled &&
                <div className={"flex justify-between mb-5"}>
                    <Button
                        type={"button"}
                        variant={"ghost"}
                        onClick={onEdit}
                    >
                        <>
                            <Pencil/>
                            <span>Edit children</span>
                        </>
                    </Button>
                </div>
            }
        </>)
}