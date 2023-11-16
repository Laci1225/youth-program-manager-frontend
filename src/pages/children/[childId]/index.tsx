import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {ChildData} from "@/model/child-data";
import getChildById from "@/api/graphql/getChildById";
import React, {useEffect, useState} from "react";
import ChildForm from "@/form/ChildForm";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table";
import Link from "next/link";
import {format} from "date-fns";
import {Toaster} from "@/components/ui/toaster";
import ShowTable from "@/form/ShowTable";
import {Label} from "@/components/ui/label";
import {fieldAppearance} from "@/components/fieldAppearance";


export const getServerSideProps = (async (context) => {
    let childData;
    if (context.params?.childId) {
        try {
            childData = await getChildById(context.params.childId);
            return {
                props: {
                    selectedChild: childData
                }
            }
        } catch (error) {
            return {
                notFound: true
            };
        }
    }
    return {
        notFound: true
    };
}) satisfies GetServerSideProps<{
    selectedChild: ChildData
}, {
    childId: string
}>;
export default function Child({selectedChild}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [existingChild, setExistingChild] = useState<ChildData>(selectedChild)

    const onChildUpdated = (newChild: ChildData) => {
        setExistingChild(newChild)
        //  window.location.reload();
    }
    useEffect(() => {
        setExistingChild(selectedChild);
    }, [selectedChild])


    return (
        <div className={"container w-4/6 py-10"}>
            <div className={"flex justify-between px-6 pb-6"}>
                <Link href={"/"}><span className="material-icons-outlined">arrow_back</span></Link>
                <div>Child details</div>
                <div><ChildForm onChildCreated={onChildUpdated} existingChild={existingChild}
                                triggerName={<span className="material-icons-outlined">edit</span>}
                                triggerVariant={"ghost"}/>
                </div>
            </div>
            <Table className={"border border-gray-700 rounded"}>
                <TableBody>
                    <TableRow key={0} className={"hover:bg-gray-200 "}>
                        <TableCell className="text-left px-10">
                            <Label>Full Name: </Label>
                            <div className={fieldAppearance}>{existingChild.givenName} {existingChild.familyName}</div>
                        </TableCell>
                    </TableRow>
                    <TableRow key={1} className={"hover:bg-gray-200"}>
                        <TableCell className="text-left px-10">
                            <Label>Birth date and place: </Label>
                            <div className={fieldAppearance}>
                                {format(new Date(existingChild.birthDate), "P")} {existingChild.birthPlace}</div>
                        </TableCell>
                    </TableRow>
                    <TableRow key={4} className={"hover:bg-gray-200"}>
                        <TableCell className="text-left px-10">
                            <Label>Address: </Label>
                            <div className={fieldAppearance}>{existingChild.address}</div>
                        </TableCell>
                    </TableRow>
                    <TableRow key={2} className={"hover:bg-gray-200"}>
                        <TableCell className="text-left px-10">
                            <ShowTable tableFields={["Name", "Diagnosed at"]}
                                       value={existingChild.diagnosedDiseases} showDeleteButton={false}/>
                        </TableCell>
                    </TableRow>
                    <TableRow key={3} className={"hover:bg-gray-200"}>
                        <TableCell className="text-left px-10">
                            <ShowTable tableFields={["Name", "Dose", "Taken since"]}
                                       value={existingChild.regularMedicines} showDeleteButton={false}/>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Toaster/>
        </div>
    )

}