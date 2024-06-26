import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import React, {Dispatch, SetStateAction} from "react";
import {ChildData} from "@/model/child-data";
import {ParentData, ParentDataWithChildren} from "@/model/parent-data";

interface ChildsParentTableProps {
    parent: ParentData;
    parentWithChildren: ParentDataWithChildren;
    setParentWithChildren: Dispatch<SetStateAction<ParentDataWithChildren>>
}

export default function ParentsChildrenTable({
                                                 parent,
                                                 parentWithChildren,
                                                 setParentWithChildren
                                             }: ChildsParentTableProps) {
    function deleteChildData(child: ChildData) {
        const updatedChildren = parentWithChildren.childDtos?.filter(value => value.id !== child.id)
        setParentWithChildren(prevState => ({...prevState, childDtos: updatedChildren}))
    }

    return (
        <Table className="w-full border border-gray-200">
            <TableHeader>
                <TableRow>
                    <TableHead className="text-left">Name</TableHead>
                    <TableHead className="text-center">isEmergencyContact</TableHead>
                    <TableHead className="w-5"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>{
                parentWithChildren.childDtos && parentWithChildren.childDtos.length !== 0 ? (
                    parentWithChildren.childDtos.map((child, index) => (
                        <TableRow key={index}>
                            <TableCell className="text-left">
                                {child.givenName} {child.familyName}
                            </TableCell>
                            <TableCell className="text-center">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        const updatedChildren = child.relativeParents?.map(relative => {
                                            if (relative.id === parent.id) {
                                                return {
                                                    ...relative,
                                                    isEmergencyContact: !relative.isEmergencyContact
                                                };
                                            }
                                            return relative;
                                        });
                                        if (updatedChildren) {
                                            const updatedChild = {
                                                ...child,
                                                relativeParents: updatedChildren
                                            };

                                            setParentWithChildren(prevState => ({
                                                ...prevState,
                                                childDtos: prevState.childDtos?.map(existingChild => {
                                                    if (existingChild.id === updatedChild.id) {
                                                        return updatedChild;
                                                    }
                                                    return existingChild;
                                                })
                                            }));
                                        }
                                    }}
                                >
                                    <span className="material-icons-outlined">
                                        {child.relativeParents?.find(parent => parent?.id === parentWithChildren.id)?.isEmergencyContact
                                            ? 'check_box' : 'check_box_outline_blank'}
                                    </span>
                                </Button>
                            </TableCell>
                            <TableCell className="text-center">
                                <Button type="button" className="p-0"
                                        variant="ghost"
                                        onClick={() => {
                                            deleteChildData(child);
                                        }}>
                                    <span className="material-icons-outlined">delete</span>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))) : (
                    <TableRow>
                        <TableCell className="text-center text-gray-400" colSpan={3}>
                            Nothing added yet
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}