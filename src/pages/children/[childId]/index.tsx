import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {ChildData} from "@/model/child-data";
import getChildById from "@/api/graphql/getChildById";
import {notFound} from "next/navigation";
import React, {Suspense, useState} from "react";
import getAllChildren from "@/api/graphql/getAllChildren";
import ChildForm from "@/form/ChildForm";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Link from "next/link";
import {format} from "date-fns";
import {Toaster} from "@/components/ui/toaster";


export const getServerSideProps = (async (context) => {
    if (context.params?.childId) {
        const childData = await getChildById(context.params.childId)
        return {
            props: {
                selectedChild: childData
                //      selectedChild: childData.getAllChildren
            }
        }
    }
    notFound()
}) satisfies GetServerSideProps<{ selectedChild: ChildData }, { childId: string }>;
export default function Child({selectedChild}: InferGetServerSidePropsType<typeof getServerSideProps>) {

    return (
        <div className={"container w-4/6 py-28"}>
            <div className={"flex justify-between px-6 pb-6"}>
                <Link href={"/"}><span className="material-icons-outlined">arrow_back</span></Link>
                <div>{selectedChild.givenName} {selectedChild.familyName}</div>
                <ChildForm onChildCreated={() => {
                }} existingChild={selectedChild}/>
                <span className="material-icons-outlined">edit</span>
                {//<ChildForm onChildCreated={onChildCreated}/>
                }
            </div>
            <Table className={"border border-gray-700 rounded"}>
                <TableBody>
                    <TableRow key={selectedChild.id} className={"hover:bg-gray-200"}>
                        <TableCell className="text-left font-bold">Name</TableCell>
                        <TableCell className="text-left pl-2">
                            {selectedChild.givenName} {selectedChild.familyName}
                        </TableCell>
                    </TableRow>
                    <TableRow key={selectedChild.id} className={"hover:bg-gray-200"}>
                        <TableCell className="text-left font-bold">Birth Date</TableCell>
                        <TableCell className="text-left pl-2">
                            {format(new Date(selectedChild.birthDate), "P")}
                        </TableCell>
                    </TableRow>
                    <TableRow key={selectedChild.id} className={"hover:bg-gray-200"}>
                        <TableCell className="text-left font-bold">Diagnosed diseases: </TableCell>
                        <TableCell className="text-left">
                            {
                                selectedChild.diagnosedDiseases?.map((disease, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{disease.name}</TableCell>
                                            <TableCell>{format(new Date(disease.diagnosedAt), "P")}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableCell>
                    </TableRow>
                    <TableRow key={selectedChild.id} className={"hover:bg-gray-200"}>
                        <TableCell className="text-left font-bold">Takes any medicines</TableCell>
                        <TableCell className="text-left">
                            {selectedChild.hasRegularMedicines ? (
                                <span className="material-icons-outlined">check_box</span>
                            ) : (
                                <span className="material-icons-outlined">check_box_outline_blank</span>
                            )}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Toaster/>
        </div>
    )

}