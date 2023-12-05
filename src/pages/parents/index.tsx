import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import React, {useState} from "react";
import {Toaster} from "@/components/ui/toaster";
import ParentForm from "@/form/parent/ParentForm";
import {serverSideClient} from "@/api/graphql/client";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import getAllParents from "@/api/graphql/parent/getAllParents";
import {Pencil, PlusSquare, Trash} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import DeleteParent from "@/form/parent/DeleteParent";

export const getServerSideProps = (async () => {
    const parents = await getAllParents(serverSideClient)
    return {
        props: {
            parentsData: parents
        }
    };
}) satisfies GetServerSideProps<{ parentsData: ParentData[] }>;

export default function Parents({parentsData}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()
    const [parents, setParents] = useState<ParentData[]>(parentsData)
    const onCParentSaved = (savedParent: ParentData) => {
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
    const [editedParent, setEditedParent] = useState<ParentData | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [deletedParent, setDeletedParent] = useState<ParentData>()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    function handleEditClick(parent: ParentData | null) {
        setIsEditDialogOpen(true)
        setEditedParent(parent)
    }

    function handleDeleteClick(parent: ParentData) {
        setIsDeleteDialogOpen(true)
        setDeletedParent(parent)
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
                        <TableHead className="text-center">Phone Numbers</TableHead>
                        <TableHead className="px-5"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        parents && parents.length !== 0 ? (
                            parents.map((parent) => (
                                <TableRow key={parent.id} className={"hover:bg-gray-300 hover:cursor-pointer"}
                                          onClick={() => router.push(`parents/${parent.id}`)}>
                                    <TableCell className="text-center">
                                        {parent.givenName} {parent.familyName}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {parent.phoneNumbers.length > 1
                                            ? (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div>
                                                                {parent.phoneNumbers[0]} (+
                                                                {parent.phoneNumbers.length - 1})
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {parent.phoneNumbers.slice(1)
                                                                .map((number, index) =>
                                                                    <p key={index}>{number}</p>)}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )
                                            : (<>{parent.phoneNumbers[0]}</>)}
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
                                                        handleEditClick(parent)
                                                    }}>
                                                    <Pencil className={"mx-1"}/>
                                                    <span>Edit</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className={"justify-center hover:cursor-pointer p-2 mx-5 bg-red-600 text-white"}
                                                    onClick={event => {
                                                        event.preventDefault()
                                                        event.stopPropagation()
                                                        handleDeleteClick(parent)
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
                                <TableCell colSpan={3}>Nothing added</TableCell>
                            </TableRow>
                        )}
                </TableBody>
            </Table>
            <Toaster/>
            <ParentForm existingParent={editedParent ?? undefined}
                        isOpen={isEditDialogOpen}
                        onParentModified={onCParentSaved}
                        onOpenChange={setIsEditDialogOpen}
            />
            <DeleteParent parent={deletedParent}
                          isOpen={isDeleteDialogOpen}
                          onOpenChange={setIsDeleteDialogOpen}
                          onSuccess={onParentDeleted}
            />
        </div>
    )
}