import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import React, {useState} from "react";
import {ChildData} from "@/model/child-data";
import ChildForm from "@/form/child/ChildForm";
import {Toaster} from "@/components/ui/toaster";
import {format} from "date-fns";
import getAllChildren from "@/api/graphql/child/getAllChildren";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {serverSideClient} from "@/api/graphql/client";
import deleteChild from "@/api/graphql/child/deleteChild";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Pencil, PlusSquare, Trash} from "lucide-react"
import {useRouter} from "next/router";
import {Button} from "@/components/ui/button";
import DeleteData from "@/components/deleteData";


export const getServerSideProps = (async () => {
    const children = await getAllChildren(serverSideClient)
    return {
        props: {
            childrenData: children
        }
    };
}) satisfies GetServerSideProps<{ childrenData: ChildData[] }>;

export default function Children({childrenData}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
        <div className={"container w-4/6 py-28"}>
            <div className={"flex justify-between px-6 pb-6"}>
                <span>Children</span>
                <Button onClick={(event) => {
                    event.preventDefault()
                    handleEditClick(null)
                }}>
                    <PlusSquare/>
                    <span>Create</span>
                </Button>
            </div>
            <Table className={"border border-gray-700 rounded"}>
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
                        children && children.length !== 0 ? (
                            children.map((child) => (
                                <TableRow key={child.id} className={"hover:bg-gray-300 hover:cursor-pointer"}
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
                                    <TableCell className="p-1 text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger onClick={event => event.preventDefault()}>
                                                <span className="material-icons-outlined">more_horiz</span>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className={"min-w-8"}>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuItem
                                                    className={"justify-center hover:cursor-pointer"}
                                                    onClick={(event) => {
                                                        event.preventDefault()
                                                        event.stopPropagation()
                                                        handleEditClick(child)
                                                    }}>
                                                    <Pencil className={"mx-1"}/>
                                                    <span>Edit</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className={"justify-center hover:cursor-pointer p-2 mx-5 bg-red-600 text-white"}
                                                    onClick={event => {
                                                        event.preventDefault()
                                                        event.stopPropagation()
                                                        handleDeleteClick(child)
                                                    }}>
                                                    <Trash className={"mx-1"}/>
                                                    <span>Delete</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))) : (
                            <TableRow>
                                <TableCell colSpan={5}>Nothing added</TableCell>
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
            <DeleteData data={deletedChild}
                        isOpen={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                        onSuccess={onChildDeleted}
                        deleteFunction={deleteChild}
                        dataType={"Child"}
            />
        </div>
    )
}