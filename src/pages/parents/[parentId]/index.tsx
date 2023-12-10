import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import React, {useState} from "react";
import Link from "next/link";
import {Toaster} from "@/components/ui/toaster";
import {Label} from "@/components/ui/label";
import {fieldAppearance} from "@/components/fieldAppearance";
import {Pencil, Trash} from "lucide-react";
import {useRouter} from "next/router";
import ParentForm from "@/form/parent/ParentForm";
import {serverSideClient} from "@/api/graphql/client";
import getParentById from "@/api/graphql/parent/getParentById";
import deleteParent from "@/api/graphql/parent/deleteParent";
import DeleteData from "@/components/deleteData";
import {ParentData} from "@/model/parent-data";


export const getServerSideProps = (async (context) => {
    let parentData;
    if (context.params?.parentId) {
        try {
            parentData = await getParentById(context.params.parentId, serverSideClient);
            return {
                props: {
                    selectedParent: parentData
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
}) satisfies GetServerSideProps<{ selectedParent: ParentData }, { parentId: string }>;
export default function Parent({selectedParent}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [parent, setParent] = useState<ParentData>(selectedParent)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const router = useRouter()
    const onParentUpdated = (newParent: ParentData) => {
        setParent(newParent)
    }
    const onParentDeleted = () => {
        router.push("/parents")
    }

    function handleEditClick() {
        setIsEditDialogOpen(true)
    }

    function handleDeleteClick() {
        setIsDeleteDialogOpen(true)
    }

    return (
        <div className={"container w-3/6 py-10 h-[100vh] overflow-auto"}>
            <div className={"flex justify-between px-6 pb-6 items-center"}>
                <Link href={"/parents"}>
                    <span className="material-icons-outlined">arrow_back</span>
                </Link>
                <div>
                    Parent details
                </div>
                <div className={"flex"}>
                    <div className={" flex flex-row items-center hover:cursor-pointer px-5"}
                         onClick={(event) => {
                             event.preventDefault()
                             handleEditClick()
                         }}>
                        <Pencil className={"mx-1"}/>
                        <span>Edit</span>
                    </div>
                    <div
                        className={"flex flex-row items-center hover:cursor-pointer rounded p-2 mx-5 bg-red-600 text-white"}
                        onClick={(event) => {
                            event.preventDefault()
                            handleDeleteClick()
                        }}>
                        <Trash className={"mx-1"}/>
                        <span>Delete</span>
                    </div>
                </div>
            </div>
            <div className="border border-gray-200 rounded p-4">
                <div className="mb-6">
                    <Label>Full Name:</Label>
                    <div className={`${fieldAppearance} mt-2`}>
                        {parent.givenName} {parent.familyName}
                    </div>
                </div>
                <div className="mb-6">
                    <Label>Phone numbers:</Label>
                    <>
                        {parent.phoneNumbers.map((numbers, index) => (
                            <div key={index} className={`${fieldAppearance} mt-2`}>
                                {numbers}
                            </div>
                        ))}
                    </>
                </div>
                <div className="mb-6">
                    <Label>Address:</Label>
                    <div className={`${fieldAppearance} mt-2`}>
                        {parent.address ?? <div className={"text-gray-400"}>Not added yet </div>}
                    </div>
                </div>
            </div>
            <Toaster/>
            <ParentForm existingParent={parent ?? undefined}
                        isOpen={isEditDialogOpen}
                        onParentModified={onParentUpdated}
                        onOpenChange={setIsEditDialogOpen}
            />
            <DeleteData entityId={parent.id}
                        entityLabel={`${parent.givenName} ${parent.familyName}`}
                        isOpen={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                        onSuccess={onParentDeleted}
                        deleteFunction={deleteParent}
                        entityType={"Parent"}
            />
        </div>
    )
}