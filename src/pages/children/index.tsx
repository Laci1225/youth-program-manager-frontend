import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
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
                        <TableHead className="p-1"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        children && children.length !== 0 ? (
                            children.map((child) => (
                                <TableRow key={child.id} className={"hover:bg-gray-200"}>
                                    <Link key={child.id} href={`children/${child.id}`} className="contents">
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
                                        <TableCell className="p-1 text-right">
                                            <Button type={"button"} variant={"destructive"}
                                                    onClick={() => {
                                                        const updatedChildren = children.filter((c) => c.id !== child.id);
                                                        setChildren(updatedChildren);
                                                    }}><span className="material-icons-outlined">delete</span></Button>
                                        </TableCell>
                                    </Link>
                                </TableRow>
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