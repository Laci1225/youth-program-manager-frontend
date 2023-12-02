import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import React, {useState} from "react";
import {Toaster} from "@/components/ui/toaster";
import Link from "next/link";
import ParentForm from "@/form/parent/ParentForm";

export default function Parents() {
    const [parents, setParents] = useState<ParentData[]>()

    return (
        <div className={"container w-4/6 py-28"}>
            <div className={"flex justify-between px-6 pb-6"}>Parents
                <ParentForm triggerName={"+ Add"} onParentCreated={() => {
                }}/>
            </div>
            <Table className={"border border-gray-700 rounded"}>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">Name</TableHead>
                        <TableHead className="text-center">Phone Numbers</TableHead>
                        <TableHead className="text-center">Address</TableHead>
                        <TableHead className="px-5"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        parents && parents.length !== 0 ? (
                            parents.map((parent) => (
                                <Link key={parent.id} href={`parents/${parent.id}`}
                                      className="contents">
                                    <TableRow key={parent.id} className={"hover:bg-gray-200"}>
                                        <TableCell className="text-center">
                                            {parent.givenName} {parent.familyName}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {}
                                        </TableCell>
                                        <TableCell className="p-1 text-center">
                                        </TableCell>
                                    </TableRow>
                                </Link>
                            ))) : (
                            <TableRow>
                                <TableCell colSpan={4}>Nothing added</TableCell>
                            </TableRow>
                        )}
                </TableBody>
            </Table>
            <Toaster/>
        </div>
    )
}