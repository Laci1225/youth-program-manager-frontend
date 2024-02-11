import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import React, {useState} from "react";
import Link from "next/link";
import {Toaster} from "@/components/ui/toaster";
import {Label} from "@/components/ui/label";
import {fieldAppearance} from "@/components/fieldAppearance";
import {AlertTriangle, Pencil, Trash} from "lucide-react";
import {useRouter} from "next/router";
import ParentForm from "@/form/parent/ParentForm";
import {serverSideClient} from "@/api/graphql/client";
import getParentById from "@/api/graphql/parent/getParentById";
import deleteParent from "@/api/graphql/parent/deleteParent";
import DeleteData from "@/components/deleteData";
import {
    ParentData,
    ParentDataWithChildren,
} from "@/model/parent-data";
import fromParentWithChildrenToParent from "@/model/fromParentWithChildrenToParent";
import SaveChildrenDataToParent from "@/table/parent/SaveChildrenDataToParent";
import HoverText from "@/components/hoverText";
import ChildInEditMode from "@/table/parent/ChildInEditMode";
import {cn} from "@/lib/utils";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ChildData} from "@/model/child-data";
import {getSession} from "@auth0/nextjs-auth0";


export const getServerSideProps = (async (context) => {
    let parentData;
    if (context.params?.parentId) {
        try {
            const session = await getSession(context.req, context.res);
            parentData = await getParentById(context.params.parentId, session?.accessToken, serverSideClient);
            return {
                props: {
                    selectedParent: parentData,
                    accessToken: session?.accessToken
                }
            }
        } catch (error) {
            return {
                notFound: true
            };
        }
    }
    return {
        notFound: true
    };
}) satisfies GetServerSideProps<{ selectedParent: ParentDataWithChildren, accessToken: string | undefined }, {
    parentId: string
}>;
export default function Parent({selectedParent, accessToken}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [parentWithChildren, setParentWithChildren] = useState<ParentDataWithChildren>(selectedParent)
    const parent: ParentData = fromParentWithChildrenToParent(parentWithChildren)
    const [isParentEditDialogOpen, setIsParentEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const router = useRouter()
    const onParentUpdated = (newParent: ParentData) => {
        setParentWithChildren((prevState) => ({...prevState, ...newParent}))
    }
    const onParentDeleted = () => {
        router.push("/parents")
    }

    function onEditClicked() {
        setIsEditChildrenModeEnabled(true)
    }

    function handleEditClick() {
        setIsParentEditDialogOpen(true)
    }

    function handleDeleteClick() {
        setIsDeleteDialogOpen(true)
    }

    const [isEditChildrenModeEnabled, setIsEditChildrenModeEnabled] = useState(false)

    return (
        <div className="container w-3/6 py-10 h-[100vh] overflow-auto">
            <div className="flex justify-between px-6 pb-6 items-center">
                <Link href="/parents">
                    <span className="material-icons-outlined">arrow_back</span>
                </Link>
                <div>
                    Parent details
                </div>
                <HoverText>
                    {
                        (!parentWithChildren.childDtos?.length) && (
                            <div className="flex">
                                <AlertTriangle className="text-yellow-600 "/>
                                Child not associated yet
                            </div>)
                    }
                </HoverText>
                <div className="flex">
                    <div className=" flex flex-row items-center hover:cursor-pointer px-5"
                         onClick={(event) => {
                             event.preventDefault()
                             handleEditClick()
                         }}>
                        <Pencil className="mx-1"/>
                        <span>Edit</span>
                    </div>
                    <div
                        className="flex flex-row items-center hover:cursor-pointer rounded p-2 mx-5 bg-red-600 text-white"
                        onClick={(event) => {
                            event.preventDefault()
                            handleDeleteClick()
                        }}>
                        <Trash className="mx-1"/>
                        <span>Delete</span>
                    </div>
                </div>
            </div>
            <div className="border border-gray-200 rounded p-4">
                <div className="mb-6">
                    <Label>Full Name:</Label>
                    <div className={`${fieldAppearance} mt-2`}>
                        {parent.givenName} {parent.familyName}
                    </div>
                </div>
                <div className="mb-6">
                    <Label>Phone numbers:</Label>
                    <>
                        {parent.phoneNumbers.map((numbers, index) => (
                            <div key={index} className={`${fieldAppearance} mt-2`}>
                                {numbers}
                            </div>
                        ))}
                    </>
                </div>
                <div
                    className={cn(`mb-6`, isEditChildrenModeEnabled && "border border-dashed border-gray-400  p-2 rounded")}>
                    <SaveChildrenDataToParent onEdit={onEditClicked}
                                              isEditChildrenModeEnabled={isEditChildrenModeEnabled}/>
                    {isEditChildrenModeEnabled ? (
                            <ChildInEditMode parent={parent}
                                             parentWithChildren={parentWithChildren}
                                             setParentWithChildren={setParentWithChildren}
                                             setIsEditChildrenModeEnabled={setIsEditChildrenModeEnabled}/>
                        ) :
                        <div className={`w-full`}>
                            <Table className="w-full border border-gray-200">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center">Name</TableHead>
                                        <TableHead className="text-center">IsEmergencyContact</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>{
                                    parentWithChildren.childDtos && parentWithChildren.childDtos?.length !== 0 ? (
                                        parentWithChildren.childDtos.map((child: ChildData, index: number) => (
                                            <TableRow key={index} className="hover:bg-gray-300 hover:cursor-pointer"
                                                      onClick={() => router.push(`/children/${child.id}`, `/children/${child.id}`)}>
                                                <TableCell className="text-center">
                                                    {child.givenName + " " + child.familyName}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                <span className="material-icons-outlined">
                                                    {child.relativeParents?.find(relative => relative.id == parent.id)?.isEmergencyContact ? 'check_box' : 'check_box_outline_blank'}
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
                </div>
                <div className="mb-6">
                    <Label>Address:</Label>
                    <div className={`${fieldAppearance} mt-2`}>
                        {parent.address ?? <div className="text-gray-400">Not added yet </div>}
                    </div>
                </div>
            </div>
            <Toaster/>
            <ParentForm existingParent={{
                ...parentWithChildren,
                childIds: parentWithChildren.childDtos?.map(child => child.id)
            } ?? undefined}
                        isOpen={isParentEditDialogOpen}
                        onParentModified={onParentUpdated}
                        onOpenChange={setIsParentEditDialogOpen}
                        accessToken={accessToken}
            />
            <DeleteData entityId={parent.id}
                        entityLabel={`${parent.givenName} ${parent.familyName}`}
                        isOpen={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                        onSuccess={onParentDeleted}
                        deleteFunction={deleteParent}
                        entityType="Parent"
                        accessToken={accessToken}
            />
        </div>
    )
}