import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {ChildData} from "@/model/child-data";
import getChildById from "@/api/graphql/getChildById";
import React, {useEffect, useState} from "react";
import ChildForm from "@/form/ChildForm";
import Link from "next/link";
import {format} from "date-fns";
import {Toaster} from "@/components/ui/toaster";
import ShowTable from "@/form/ShowTable";
import {Label} from "@/components/ui/label";
import {fieldAppearance} from "@/components/fieldAppearance";
import {serverSideClient} from "@/api/graphql/client";
import {Button} from "@/components/ui/button";


export const getServerSideProps = (async (context) => {
    let childData;
    if (context.params?.childId) {
        try {
            childData = await getChildById(context.params.childId, serverSideClient);
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
}) satisfies GetServerSideProps<{ selectedChild: ChildData }, { childId: string }>;
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
            <div className={"flex justify-between px-6 pb-6 items-center"}>
                <Button asChild variant="ghost" size="icon">
                    <Link href={"/"}><span className="material-icons-outlined">arrow_back</span></Link>
                </Button>
                <div>
                    Child details
                </div>
                <div>
                    <ChildForm onChildCreated={onChildUpdated}
                               existingChild={existingChild}
                               triggerName={<span className="material-icons-outlined">edit</span>}
                               triggerVariant={"ghost"}/>
                </div>
            </div>
            <div className="border border-gray-200 rounded p-4">
                <div className="mb-6">
                    <Label>Full Name:</Label>
                    <div className={`${fieldAppearance} mt-2`}>
                        {selectedChild.givenName} {selectedChild.familyName}
                    </div>
                </div>
                <div className="mb-6">
                    <Label>Birth date and place:</Label>
                    <div className={`${fieldAppearance} mt-2`}>
                        {format(new Date(selectedChild.birthDate), "P")} {selectedChild.birthPlace}
                    </div>
                </div>
                <div className="mb-6">
                    <Label>Address:</Label>
                    <div className={`${fieldAppearance} mt-2`}>
                        {selectedChild.address}
                    </div>
                </div>
                <ShowTable tableFields={["Name", "Diagnosed at"]} value={selectedChild.diagnosedDiseases}
                           showDeleteButton={false}/>
                <ShowTable tableFields={["Name", "Dose", "Taken since"]} value={selectedChild.regularMedicines}
                           showDeleteButton={false}/>
            </div>
            <Toaster/>
        </div>
    )

}