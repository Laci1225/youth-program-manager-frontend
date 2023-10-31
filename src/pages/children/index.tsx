import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {ChildData} from "@/model/child-data";
import {client} from "@/api/client";
import {gql} from "@apollo/client";
import ChildForm from "@/form/ChildForm";
import {Toaster} from "@/components/ui/toaster";
import {format} from "date-fns";

/*
export const getServerSideProps = (async () => {

        return {
            props: {
                children
            }
        };
}) satisfies GetServerSideProps<{ children: ChildData[] }>;

export default function Seasons({children}: InferGetServerSidePropsType<typeof getServerSideProps>) {
*/
export default function Children() {
    const [children, setChildren] = useState<ChildData[]>([])
    useEffect(() => {
        client
            .query({
                query: gql(`
                query GetChild {
                    children {
                        id
                        familyName
                        givenName
                        birthDate
                        address
                        hasDiagnosedDiseases
                        hasRegularMedicines
                    }
                }
            `),
            })
            .then((result) => setChildren(result.data.children));
    }, []);

    return (
        <div className={"container w-4/6 p-28"}>
            <div className={"flex justify-between px-6 pb-6"}>Children
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>+ Add</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px] h-full overflow-auto">
                        <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                        </DialogHeader>
                        <ChildForm/>
                    </DialogContent>
                </Dialog>
            </div>
            <Table className={"border border-gray-700 rounded"}>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/5 text-center">Name</TableHead>
                        <TableHead className="w-1/5 text-center">Birth Date</TableHead>
                        <TableHead className="w-1/5 text-center">Has diagnosed diseases</TableHead>
                        <TableHead className="w-1/5 text-center">Takes any medicines</TableHead>
                        <TableHead className="w-1/5 text-right pr-12">Edit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        children && children.length !== 0 ? (
                            children.map((child) => (
                                <TableRow key={child.id}>
                                    <TableCell
                                        className="w-1/5 text-center">{child.givenName} {child.familyName}</TableCell>
                                    <TableCell
                                        className="w-1/5 text-center">{format(new Date(child.birthDate), "P")}</TableCell>
                                    <TableCell className="w-1/5 text-center">{child.hasDiagnosedDiseases ?
                                        <span className="material-icons-outlined">check_box</span> :
                                        <span className="material-icons-outlined">check_box_outline_blank</span>}
                                    </TableCell>
                                    <TableCell className="w-1/5 text-center">{child.hasRegularMedicines ?
                                        <span className="material-icons-outlined">check_box</span> :
                                        <span className="material-icons-outlined">check_box_outline_blank</span>}
                                    </TableCell>
                                    <TableCell className="w-1/5 text-right">
                                        <Button type={"button"} variant={"destructive"}
                                                onClick={() => {
                                                    const updatedChildren = children.filter((c) => c.id !== child.id);
                                                    setChildren(updatedChildren);
                                                }}><span className="material-icons-outlined">delete</span></Button>
                                    </TableCell>
                                </TableRow>
                            ))) : (
                            <TableRow>
                                <TableCell className="w-1/2">Nothing</TableCell>
                                <TableCell className="w-1/2">added</TableCell>

                            </TableRow>
                        )}
                </TableBody>
            </Table>
            <Toaster/>
        </div>
    )
}