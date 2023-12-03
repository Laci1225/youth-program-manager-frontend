import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {ChildData} from "@/model/child-data";
import getChildById from "@/api/graphql/getChildById";
import React, {useState} from "react";
import ChildForm from "@/form/ChildForm";
import Link from "next/link";
import {format} from "date-fns";
import {Toaster} from "@/components/ui/toaster";
import ShowTable from "@/form/ShowTable";
import {Label} from "@/components/ui/label";
import {fieldAppearance} from "@/components/fieldAppearance";
import {serverSideClient} from "@/api/graphql/client";
import DeleteChild from "@/components/deleteChild";
import {Pencil, Trash} from "lucide-react";


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
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editedChild, setEditedChild] = useState<ChildData | null>(null)
    const [deletedChild, setDeletedChild] = useState<ChildData>()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const onChildUpdated = (newChild: ChildData) => {
        setExistingChild(newChild)
    }

    function handleEditClick(child: ChildData) {
        setIsEditDialogOpen(true)
        setEditedChild(child)
    }

    function handleDeleteClick(child: ChildData) {
        setIsDeleteDialogOpen(true)
        setDeletedChild(child)
    }

    return (
        <div className={"container w-3/6 py-10 h-[100vh] overflow-auto"}>
            <div className={"flex justify-between px-6 pb-6"}>
                <Link href={"/"}>
                    <span className="material-icons-outlined">arrow_back</span>
                </Link>
                <div>
                    Child details
                </div>
                <div className={"flex"}>
                    <div className={" flex flex-row items-center hover:cursor-pointer px-5"}
                         onClick={(event) => {
                             event.preventDefault()
                             handleEditClick(existingChild)
                         }}>
                        <Pencil/>
                        <span>Edit</span>
                    </div>
                    <div className={" flex flex-row items-center hover:cursor-pointer px-5"}
                         onClick={(event) => {
                             event.preventDefault()
                             handleDeleteClick(existingChild)
                         }}>
                        <Trash/>
                        <span>Delete</span>
                    </div>
                </div>
            </div>
            <div className="border border-gray-200 rounded p-4">
                <div className="mb-6">
                    <Label>Full Name:</Label>
                    <div className={`${fieldAppearance} mt-2`}>
                        {existingChild.givenName} {existingChild.familyName}
                    </div>
                </div>
                <div className="mb-6">
                    <Label>Birth date and place:</Label>
                    <div className={`${fieldAppearance} mt-2`}>
                        {format(new Date(existingChild.birthDate), "P")} {existingChild.birthPlace}
                    </div>
                </div>
                <div className="mb-6">
                    <Label>Address:</Label>
                    <div className={`${fieldAppearance} mt-2`}>
                        {existingChild.address}
                    </div>
                </div>
                <ShowTable tableFields={["Name", "Diagnosed at"]} value={existingChild.diagnosedDiseases}
                           showDeleteButton={false}/>
                <ShowTable tableFields={["Name", "Dose", "Taken since"]} value={existingChild.regularMedicines}
                           showDeleteButton={false}/>
            </div>
            <Toaster/>
            <ChildForm existingChild={editedChild ?? undefined} isOpen={isEditDialogOpen}
                       onChildModified={onChildUpdated}
                       onOpenChange={setIsEditDialogOpen}
            />
            <DeleteChild child={deletedChild}
                         isOpen={isDeleteDialogOpen}
                         onOpenChange={setIsDeleteDialogOpen}/>
        </div>
    )

}