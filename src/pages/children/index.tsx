import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {ChildData} from "@/model/child-data";
import ChildForm from "@/form/ChildForm";
import {Toaster} from "@/components/ui/toaster";
import {format} from "date-fns";
import getAllChildren from "@/api/graphql/getAllChildren";
import Link from "next/link";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {serverSideClient} from "@/api/graphql/client";
import deleteChild from "@/api/graphql/deleteChild";
import {toast} from "@/components/ui/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";


export const getServerSideProps = (async () => {
    const children = await getAllChildren(serverSideClient)
    return {
        props: {
            childrenData: children
        }
    };
}) satisfies GetServerSideProps<{ childrenData: ChildData[] }>;

export default function Children({childrenData}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [children, setChildren] = useState<ChildData[]>(childrenData)
    const onChildCreated = (newChild: ChildData) => {
        setChildren(prevState => [...prevState, newChild])
    }

    return (
        <div className={"container w-4/6 py-28"}>
            <div className={"flex justify-between px-6 pb-6"}>Children
                <ChildForm onChildCreated={onChildCreated} triggerName={"+ Add"}/>
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
                                <Link key={child.id} href={`children/${child.id}`}
                                      className="contents">
                                    <TableRow key={child.id} className={"hover:bg-gray-200"}>
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
                                            <span
                                                className="material-icons-outlined">check_box_outline_blank</span>}
                                        </TableCell>
                                        <TableCell className="p-1 text-center">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger onClick={event => event.preventDefault()}>
                                                    <span className="material-icons-outlined">more_horiz</span>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className={"min-w-8"}>
                                                    <DropdownMenuSeparator/>
                                                    <DropdownMenuItem className={"justify-center"}>
                                                        <Button variant={"ghost"}>
                                                            <span className="material-icons-outlined">edit</span>
                                                        </Button>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className={"justify-center"}
                                                                      onClick={e => e.preventDefault()}>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button type={"button"} variant={"destructive"}>
                                                                    <span
                                                                        className="material-icons-outlined">delete</span>
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely
                                                                        sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will
                                                                        permanently delete your
                                                                        account and remove your data from our servers.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={async () => {
                                                                            await deleteChild(child.id)
                                                                                .then((deletedChild) => {
                                                                                        toast({
                                                                                            variant: "default",
                                                                                            title: "Child data deleted successfully",
                                                                                            description: `${deletedChild.givenName} ${deletedChild.familyName} deleted`
                                                                                        })
                                                                                        const updatedChildren = children.filter(c => c.id !== child.id)
                                                                                        setChildren(updatedChildren);
                                                                                    }
                                                                                ).catch(error => {
                                                                                    if (error.response && error.response.status === 400) {
                                                                                        alert("Dont have permission to do that")
                                                                                    }
                                                                                });
                                                                        }
                                                                        }>Continue</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                </Link>
                            ))) : (
                            <TableRow>
                                <TableCell colSpan={5}>Nothing added</TableCell>
                            </TableRow>
                        )}
                </TableBody>
            </Table>
            <Toaster/>
        </div>
    )
}