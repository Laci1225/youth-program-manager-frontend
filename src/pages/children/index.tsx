import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {ChildData} from "@/model/child-data";
import {client} from "@/api/client";
import {gql} from "@apollo/client";
import {redirect} from "next/navigation";
import {router} from "next/client";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import ChildForm from "@/form/ChildForm";

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
                    }
                }
            `),
            })
            .then((result) => setChildren(result.data.children));
    }, []);

    return (
        <div className={"container w-4/6"}>
            <Table>
                <TableCaption>A list of added Children.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/5">Family Name</TableHead>
                        <TableHead className="w-1/5">Given Name</TableHead>
                        <TableHead className="w-1/5">Birth Date</TableHead>
                        <TableHead className="w-1/5">Address</TableHead>
                        <TableHead className="w-1/5 text-right">Edit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        children && children.length !== 0 ? (
                            children.map((child) => (
                                <TableRow key={child.id}>
                                    <TableCell className="w-1/5">{child.familyName}</TableCell>
                                    <TableCell className="w-1/5">{child.givenName}</TableCell>
                                    <TableCell className="w-1/5">{child.birthDate}</TableCell>
                                    <TableCell className="w-1/5">{child.address}</TableCell>
                                    <TableCell className="w-1/5 text-right">
                                        <Button type={"button"} variant={"destructive"}
                                                onClick={() => {
                                                    const updatedChildren = children.filter((c) => c.id !== child.id);
                                                    setChildren(updatedChildren);
                                                }}>Remove</Button>
                                    </TableCell>
                                </TableRow>
                            ))) : (
                            <TableRow>
                                <TableCell className="w-1/2">Nothing</TableCell>
                                <TableCell className="w-1/2">added</TableCell>

                            </TableRow>
                        )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={5}>
                            <Dialog >
                                <DialogTrigger asChild>
                                    <Button type={"button"} className="w-full h-2">
                                        Add child
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[800px] h-full overflow-auto">
                                    <DialogHeader>
                                        <DialogTitle>Edit profile</DialogTitle>
                                        <DialogDescription>
                                            Make changes to your profile here. Click save when you're done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <ChildForm/>

                                </DialogContent>
                            </Dialog>

                        </TableCell>
                    </TableRow>

                </TableFooter>
            </Table>
        </div>
    )
}