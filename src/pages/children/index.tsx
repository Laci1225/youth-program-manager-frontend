import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import React, {useContext, useEffect, useState} from "react";
import {ChildData} from "@/model/child-data";
import ChildForm from "@/form/child/ChildForm";
import {Toaster} from "@/components/ui/toaster";
import {format} from "date-fns";
import getAllChildren from "@/api/graphql/child/getAllChildren";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {serverSideClient} from "@/api/graphql/client";
import deleteChild from "@/api/graphql/child/deleteChild";
import {AlertTriangle, PlusSquare} from "lucide-react"
import {useRouter} from "next/router";
import {Button} from "@/components/ui/button";
import DeleteData from "@/components/deleteData";
import HoverText from "@/components/hoverText";
import SettingsDropdown from "@/components/SettingsDropdown";
import {getSession, withPageAuthRequired} from "@auth0/nextjs-auth0";
import AccessTokenContext from "@/context/access-token-context";
import PermissionContext from "@/context/permission-context";
import {CREATE_CHILDREN, DELETE_CHILDREN, LIST_CHILDREN, UPDATE_CHILDREN} from "@/constants/auth0-permissions";
import getPermissions from "@/utils/getPermissions";
import {cn} from "@/lib/utils";

export const getServerSideProps = withPageAuthRequired<{
    childrenData: ChildData[],
    accessToken: string,
    permissions: string[]
}>({
    async getServerSideProps(context) {
        const session = await getSession(context.req, context.res);
        const permissions = await getPermissions(session);
        if (session?.accessTokenExpiresAt && session.accessTokenExpiresAt < Date.now() / 1000) {
            context.res.writeHead(302, { Location: '/api/auth/logout' }).end();
            return { props: {} as any };
        } //todo to every page
        if (permissions.includes(LIST_CHILDREN)){
            const children = await getAllChildren(session?.accessToken, serverSideClient);
            return {
                props: {
                    childrenData: children,
                    accessToken: session!.accessToken!,
                    permissions: permissions
                },
            }
        } else {
            return {
                notFound: true
            }
        }
    }
}) satisfies GetServerSideProps<{ childrenData: ChildData[] }>;
export default function Children({
                                     childrenData,
                                     accessToken,
                                     permissions
                                 }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const {setPermissions} = useContext(PermissionContext)
    useEffect(() => {
        setPermissions(permissions)
    }, [permissions, setPermissions]);
    const router = useRouter()
    const [children, setChildren] = useState<ChildData[]>(childrenData)
    const onChildSaved = (savedChild: ChildData) => {
        if (editedChild) {
            const modifiedChildren = children.map((child) =>
                child.id === savedChild.id ? savedChild : child
            );
            setChildren(modifiedChildren)
        } else {
            setChildren(prevState => [...prevState, savedChild])
        }
    }
    const onChildDeleted = (child: ChildData) => {
        const updatedChildren = children.filter(c => c.id !== child.id);
        setChildren(updatedChildren);
    }

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editedChild, setEditedChild] = useState<ChildData | null>(null)
    const [deletedChild, setDeletedChild] = useState<ChildData>()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    function handleEditClick(child: ChildData | null) {
        setIsEditDialogOpen(true)
        setEditedChild(child)
    }

    function handleDeleteClick(child: ChildData) {
        setIsDeleteDialogOpen(true)
        setDeletedChild(child)
    }

    return (
        <AccessTokenContext.Provider value={accessToken}>
            <div className="container w-4/6 py-28">
                {
                    permissions.includes(CREATE_CHILDREN) && (
                        <div className="flex justify-between px-6 pb-6">
                            <span className="text-2xl font-bold text-gray-800">Children List</span>
                            <Button onClick={(event) => {
                                event.preventDefault()
                                handleEditClick(null)
                            }}>
                                <PlusSquare size={20} className="mr-1"/>
                                <span>Create</span>
                            </Button>
                        </div>)
                }
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Name</TableHead>
                            <TableHead className="text-center">Birth Date</TableHead>
                            <TableHead className="text-center">Has diagnosed diseases</TableHead>
                            <TableHead className="text-center">Takes any medicines</TableHead>
                            <TableHead className="px-5"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            !!children ? (
                                children.map((child, index) => (
                                    <TableRow
                                        key={child.id}
                                        className={cn(`hover:bg-blue-100 hover:cursor-pointer transition-all`, index % 2 === 0 ? 'bg-gray-100' : 'bg-white')}
                                        onClick={() => router.push(`children/${child.id}`)}>
                                        <TableCell className="text-center">
                                            {child.givenName} {child.familyName}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {format(new Date(child.birthDate), "P")}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {child.hasDiagnosedDiseases ?
                                                <span className="material-icons-outlined">check_box</span> :
                                                <span
                                                    className="material-icons-outlined">check_box_outline_blank</span>}
                                        </TableCell>
                                        <TableCell className="text-center">{child.hasRegularMedicines ?
                                            <span className="material-icons-outlined">check_box</span> :
                                            <span className="material-icons-outlined">check_box_outline_blank</span>}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <HoverText content="Parent not associated yet">
                                                {
                                                    (!child.relativeParents?.length) && (
                                                        <AlertTriangle className="text-yellow-600 "/>)
                                                }
                                            </HoverText>
                                        </TableCell>
                                        <TableCell className="p-1 text-center">
                                            {
                                                <SettingsDropdown
                                                    handleEditClick={() => handleEditClick(child)}
                                                    handleDeleteClick={() => handleDeleteClick(child)}
                                                    editPermission={UPDATE_CHILDREN}
                                                    deletePermission={DELETE_CHILDREN}
                                                />
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-gray-500">
                                        Nothing added
                                    </TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table>
                <Toaster/>

                <ChildForm existingChild={editedChild ?? undefined}
                           isOpen={isEditDialogOpen}
                           onChildModified={onChildSaved}
                           onOpenChange={setIsEditDialogOpen}
                />
                <DeleteData entityId={deletedChild?.id}
                            entityLabel={`${deletedChild?.givenName} ${deletedChild?.familyName}`}
                            isOpen={isDeleteDialogOpen}
                            onOpenChange={setIsDeleteDialogOpen}
                            onSuccess={onChildDeleted}
                            deleteFunction={deleteChild}
                            entityType="Child"
                />
            </div>
        </AccessTokenContext.Provider>
    )
}