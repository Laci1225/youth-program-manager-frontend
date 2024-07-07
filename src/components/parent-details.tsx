import {ParentDataWithChildren} from "@/model/parent-data";
import {Label} from "@/components/ui/label";
import {fieldAppearance} from "@/components/fieldAppearance";
import {cn} from "@/lib/utils";
import {UPDATE_CHILDREN} from "@/constants/auth0-permissions";
import SaveChildrenDataToParent from "@/table/parent/SaveChildrenDataToParent";
import ChildInEditMode from "@/table/parent/ChildInEditMode";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ChildData} from "@/model/child-data";
import React from "react";

interface ParentDetailsProps {
    parentData: ParentDataWithChildren,
    permissions: string[]
}

export default function ParentDetails({parentData, permissions}: ParentDetailsProps) {
    return (
        <div className="border border-gray-200 rounded p-4">
            <div className="mb-6">
                <Label>Email address:</Label>
                <div className={`${fieldAppearance} mt-2`}>
                    {parentData.email}
                </div>
            </div>
            <div className="mb-6">
                <Label>Full Name:</Label>
                <div className={`${fieldAppearance} mt-2`}>
                    {parentData.givenName} {parentData.familyName}
                </div>
            </div>
            <div className="mb-6">
                <Label>Phone numbers:</Label>
                <>
                    {parentData.phoneNumbers.map((numbers, index) => (
                        <div key={index} className={`${fieldAppearance} mt-2`}>
                            {numbers}
                        </div>
                    ))}
                </>
            </div>
            {/*<div
                className={cn(`mb-6`, isEditChildrenModeEnabled && "border border-dashed border-gray-400  p-2 rounded")}>
                {
                    permissions.includes(UPDATE_CHILDREN) && (
                        <SaveChildrenDataToParent onEdit={onEditClicked}
                                                  isEditChildrenModeEnabled={isEditChildrenModeEnabled}/>)
                }
                {isEditChildrenModeEnabled ? (
                        <ChildInEditMode parent={parentData}
                                         parentWithChildren={parentWithChildren}
                                         setParentWithChildren={setParentWithChildren}
                                         setIsEditChildrenModeEnabled={setIsEditChildrenModeEnabled}/>
                    ) :
                    <div className={`w-full`}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">Name</TableHead>
                                    <TableHead className="text-center">IsEmergencyContact</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>{
                                !!parentWithChildren.childDtos ? (
                                    parentWithChildren.childDtos.map((child: ChildData, index: number) => (
                                        <TableRow key={index}
                                                  className={`hover:bg-blue-100 hover:cursor-pointer transition-all ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                                                  onClick={() => router.push(`/children/${child.id}`, `/children/${child.id}`)}>
                                            <TableCell className="text-center">
                                                {child.givenName + " " + child.familyName}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="material-icons-outlined">
                                                    {child.relativeParents?.find(relative => relative.id == parentData.id)?.isEmergencyContact ? 'check_box' : 'check_box_outline_blank'}
                                                </span>
                                            </TableCell>

                                        </TableRow>
                                    ))) : (
                                    <TableRow>
                                        <TableCell className="text-center text-gray-400"
                                                   colSpan={2}>
                                            Nothing added yet
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                }
            </div>*/}
            <div className="mb-6">
                <Label>Address:</Label>
                <div className={`${fieldAppearance} mt-2`}>
                    {parentData.address ?? <div className="text-gray-400">Not added yet </div>}
                </div>
            </div>
        </div>
    )

}