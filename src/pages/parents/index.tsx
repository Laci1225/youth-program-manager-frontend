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
import ParentForm from "@/form/parent/ParentForm";
import {serverSideClient} from "@/api/graphql/child/client";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import getAllParents from "@/api/graphql/parent/getAllParents";

export const getServerSideProps = (async () => {
    const parents = await getAllParents(serverSideClient)
    return {
        props: {
            parentsData: parents
        }
    };
}) satisfies GetServerSideProps<{ parentsData: ParentData[] }>;

export default function Parents({parentsData}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [parents, setParents] = useState<ParentData[]>(parentsData)
    const onParentCreated = (newParent: ParentData) => {
        setParents(prevState => [...prevState, newParent])
    }
    return (
        <div className={"container w-4/6 py-28"}>
            <div className={"flex justify-between px-6 pb-6"}>Parents
                <ParentForm triggerName={"+ Create"} onParentCreated={onParentCreated}/>
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
                                <TableRow key={parent.id} className={"hover:bg-gray-200"}>
                                    <TableCell className="text-center">
                                        {parent.givenName} {parent.familyName}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {parent.phoneNumbers.length > 1
                                            ? (<>{parent.phoneNumbers[0]} + {parent.phoneNumbers.length - 1} phone
                                                number(s)</>)
                                            : (<>{parent.phoneNumbers[0]}</>)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {parent.address ?? "Not added"}
                                    </TableCell>
                                    <TableCell className="p-1 text-center">
                                    </TableCell>
                                </TableRow>
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