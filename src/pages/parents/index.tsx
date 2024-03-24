import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import React, {useContext, useEffect, useState} from "react";
import {Toaster} from "@/components/ui/toaster";
import ParentForm from "@/form/parent/ParentForm";
import {serverSideClient} from "@/api/graphql/client";
import {InferGetServerSidePropsType} from "next";
import getAllParents from "@/api/graphql/parent/getAllParents";
import {AlertTriangle, PlusSquare} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import deleteParent from "@/api/graphql/parent/deleteParent";
import DeleteData from "@/components/deleteData";
import {ParentData, ParentDataWithChildrenIds} from "@/model/parent-data";
import HoverText from "@/components/hoverText";
import SettingsDropdown from "@/components/SettingsDropdown";
import AccessTokenContext from "@/context/access-token-context";
import {getSession, withPageAuthRequired} from "@auth0/nextjs-auth0";
import jwt from "jsonwebtoken";
import PermissionContext from "@/context/permission-context";
import {CREATE_PARENTS, DELETE_PARENTS, LIST_PARENTS, UPDATE_PARENTS} from "@/constants/auth0-permissions";
import getPermissions from "@/utils/getPermissions";
import {cn} from "@/lib/utils";

export const getServerSideProps = withPageAuthRequired<{
    parentsData: ParentDataWithChildrenIds[],
    accessToken: string,
    permissions: string[]
}>({
    async getServerSideProps(context) {
        const session = await getSession(context.req, context.res);
        const permissions = await getPermissions(session);
        if (permissions.includes(LIST_PARENTS)) {
            const parents = await getAllParents(session?.accessToken, serverSideClient)
            return {
                props: {
                    parentsData: parents,
                    accessToken: session!.accessToken!,
                    permissions: permissions
                }
            }
        } else {
            return {
                notFound: true
            }
        }
    }
})

export default function Parents({
                                    parentsData,
                                    accessToken,
                                    permissions
                                }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const {setPermissions} = useContext(PermissionContext)
    useEffect(() => {
        setPermissions(permissions)
    }, [permissions, setPermissions]);
    const router = useRouter()
    const [parents, setParents] = useState<ParentDataWithChildrenIds[]>(parentsData)
    const onParentSaved = (savedParent: ParentData) => {
        if (editedParent) {
            const modifiedParents = parents.map((parent) =>
                parent.id === savedParent.id ? savedParent : parent
            );
            setParents(modifiedParents)
        } else {
            setParents(prevState => [...prevState, savedParent])
        }
    }
    const onParentDeleted = (parent: ParentData) => {
        const updatedParents = parents.filter(p => p.id !== parent.id);
        setParents(updatedParents);
    }
    const [editedParent, setEditedParent] = useState<ParentDataWithChildrenIds | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [deletedParent, setDeletedParent] = useState<ParentData>()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    function handleEditClick(parent: ParentDataWithChildrenIds | null) {
        setIsEditDialogOpen(true)
        setEditedParent(parent)
    }

    function handleDeleteClick(parent: ParentData) {
        setIsDeleteDialogOpen(true)
        setDeletedParent(parent)
    }

    return (
        <AccessTokenContext.Provider value={accessToken}>
            <div className="container w-4/6 py-28">
                <div className="flex justify-between px-6 pb-6">
                    <span className="text-2xl font-bold text-gray-800">Parents List</span>
                    {
                        permissions.includes(CREATE_PARENTS) && (
                            <Button onClick={(event) => {
                                event.preventDefault()
                                handleEditClick(null)
                            }}>
                                <PlusSquare size={20} className="mr-1"/>
                                <span>Create</span>
                            </Button>)
                    }
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Name</TableHead>
                            <TableHead className="text-center">Phone Numbers</TableHead>
                            <TableHead className="px-5"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            !!parents ? (
                                parents.map((parent, index) => (
                                    <TableRow key={parent.id}
                                              className={cn(`hover:bg-blue-100 hover:cursor-pointer transition-all`, index % 2 === 0 ? 'bg-gray-100' : 'bg-white')}
                                              onClick={() => router.push(`parents/${parent.id}`)}>
                                        <TableCell className="text-center">
                                            {parent.email}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {parent.givenName} {parent.familyName}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {parent.phoneNumbers.length > 1
                                                ? (
                                                    <HoverText
                                                        content={
                                                            parent.phoneNumbers.slice(1)
                                                                .map((number, index) =>
                                                                    <p key={index}>{number}</p>)
                                                        }>
                                                        <div>
                                                            {parent.phoneNumbers[0]} (+
                                                            {parent.phoneNumbers.length - 1})
                                                        </div>
                                                    </HoverText>
                                                )
                                                : (<>{parent.phoneNumbers[0]}</>)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <HoverText content="Child not associated yet">
                                                {
                                                    (!parent.childIds?.length) && (
                                                        <AlertTriangle className="text-yellow-600 "/>)
                                                }
                                            </HoverText>
                                        </TableCell>
                                        <TableCell className="p-1 text-center">
                                            {
                                                <SettingsDropdown
                                                    handleEditClick={() => handleEditClick(parent)}
                                                    handleDeleteClick={() => handleDeleteClick(parent)}
                                                    editPermission={UPDATE_PARENTS}
                                                    deletePermission={DELETE_PARENTS}
                                                />
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))) : (
                                <TableRow>
                                    <TableCell colSpan={3}>Nothing added</TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table>
                <Toaster/>
                <ParentForm existingParent={editedParent ?? undefined}
                            isOpen={isEditDialogOpen}
                            onParentModified={onParentSaved}
                            onOpenChange={setIsEditDialogOpen}
                />
                <DeleteData entityId={deletedParent?.id}
                            entityLabel={`${deletedParent?.givenName} ${deletedParent?.familyName}`}
                            isOpen={isDeleteDialogOpen}
                            onOpenChange={setIsDeleteDialogOpen}
                            onSuccess={onParentDeleted}
                            deleteFunction={deleteParent}
                            entityType="Parent"
                />
            </div>
        </AccessTokenContext.Provider>
    )
}