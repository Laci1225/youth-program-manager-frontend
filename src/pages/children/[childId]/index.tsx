import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {ChildData} from "@/model/child-data";
import getChildById from "@/api/graphql/getChildById";
import React from "react";
import ChildForm from "@/form/ChildForm";
import Link from "next/link";
import {format} from "date-fns";
import {Toaster} from "@/components/ui/toaster";
import ShowTable from "@/form/ShowTable";
import {Label} from "@/components/ui/label";
import {fieldAppearance} from "@/components/fieldAppearance";
import {serverSideClient} from "@/api/graphql/client";
import deleteChild from "@/api/graphql/deleteChild";
import {toast} from "@/components/ui/use-toast";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";


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
    const router = useRouter();
    const handleDelete = async (event) => {
        event.preventDefault();
        try {
            const deletedChild = await deleteChild(selectedChild.id);
            toast({
                variant: "default",
                title: "Child data deleted successfully",
                description: `${deletedChild.givenName} ${deletedChild.familyName} deleted`
            });
            router.push('/children');
        } catch (error) {
            console.error('Deletion failed', error);
        }
    };
    return (
        <div className={"container w-3/6 py-10 h-[100vh] overflow-auto"}>
            <div className={"flex justify-between px-6 pb-6"}>
                <Link href={"/"}>
                    <span className="material-icons-outlined">arrow_back</span>
                </Link>
                <div>
                    Child details
                </div>
                <div>
                    <ChildForm onChildCreated={() => {
                    }}
                               existingChild={selectedChild}
                               triggerName={<span className="material-icons-outlined">edit</span>}
                               triggerVariant={"ghost"}/>
                    <Button type={"button"} variant={"ghost"}
                            onClick={handleDelete}><span
                        className="material-icons-outlined">delete</span>
                    </Button>
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