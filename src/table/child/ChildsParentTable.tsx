import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import React, {Dispatch, SetStateAction} from "react";
import {ChildData, ChildDataWithParents} from "@/model/child-data";
import {ParentDataWithEmergencyContact} from "@/model/parent-data";

interface ChildsParentTableProps {
    childWithParents: ChildDataWithParents;
    child: ChildData;
    setChildWithParents: Dispatch<SetStateAction<ChildDataWithParents>>
}

export default function ChildsParentTable({child, childWithParents, setChildWithParents}: ChildsParentTableProps) {
    function deleteChildData(parent: ParentDataWithEmergencyContact) {
        const updatedParent = childWithParents.parents?.filter(value => value.parentDto.id !== parent.parentDto.id)
        setChildWithParents(prevState => ({...prevState, parents: updatedParent}))
    }

    return (
        <Table className={"w-full border border-gray-200"}>
            <TableHeader>
                <TableRow>
                    <TableHead className={"text-left"}>Name</TableHead>
                    <TableHead className="text-center">isEmergencyContact</TableHead>
                    <TableHead className="w-5"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>{
                childWithParents.parents && childWithParents.parents.length !== 0 ? (
                    childWithParents.parents.map((parent, index) => (
                        <TableRow key={index}>
                            <TableCell className={"text-left"}>
                                {parent.parentDto.givenName} {parent.parentDto.familyName}
                            </TableCell>
                            <TableCell className={"text-center"}>
                                <Button
                                    type={"button"}
                                    variant={"ghost"}
                                    onClick={() => {
                                        const updatedParents = child.relativeParents?.map(relative => {
                                            if (relative.id === parent.parentDto.id) {
                                                return {
                                                    ...relative,
                                                    isEmergencyContact: !relative.isEmergencyContact
                                                };
                                            }
                                            return relative;
                                        });
                                        if (updatedParents) {
                                            const updatedChild = {
                                                ...child,
                                                relativeParents: updatedParents
                                            };
                                            setChildWithParents(prevState => ({
                                                ...prevState,
                                                childDto: updatedChild,
                                                parents: prevState.parents?.map(relative => {
                                                    if (relative.parentDto.id === parent.parentDto.id) {
                                                        return {
                                                            ...relative,
                                                            isEmergencyContact: !relative.isEmergencyContact
                                                        };
                                                    }
                                                    return relative;
                                                })
                                            }));
                                        }
                                    }}
                                >
                                                        <span className={"material-icons-outlined"}>
                                                            {parent.isEmergencyContact ? 'check_box' : 'check_box_outline_blank'}
                                                        </span>
                                </Button>
                            </TableCell>

                            <TableCell className={"text-center"}>
                                <Button type={"button"} className="p-0"
                                        variant={"ghost"}
                                        onClick={() => {
                                            deleteChildData(parent);
                                        }}>
                                    <span className="material-icons-outlined">delete</span>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))) : (
                    <TableRow>
                        <TableCell className={"text-center text-gray-400"} colSpan={3}>
                            Nothing added yet
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}