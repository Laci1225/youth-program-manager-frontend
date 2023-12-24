import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {ChildData, RelativeParent} from "@/model/child-data";
import getChildById from "@/api/graphql/child/getChildById";
import React, {useEffect, useState} from "react";
import ChildForm from "@/form/child/ChildForm";
import Link from "next/link";
import {format} from "date-fns";
import {Toaster} from "@/components/ui/toaster";
import ShowTable from "@/form/ShowTable";
import {Label} from "@/components/ui/label";
import {fieldAppearance} from "@/components/fieldAppearance";
import {serverSideClient} from "@/api/graphql/client";
import {useRouter} from "next/router";
import {AlertTriangle, Pencil, PlusSquare, Trash} from "lucide-react";
import DeleteData from "@/components/deleteData";
import deleteChild from "@/api/graphql/child/deleteChild";
import getParentById from "@/api/graphql/parent/getParentById";
import {AutoComplete} from "@/form/child/AutoComplete";
import {Button} from "@/components/ui/button";
import updateChild from "@/api/graphql/child/updateChild";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {toast} from "@/components/ui/use-toast";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import HoverText from "@/components/hoverText";
import ParentForm from "@/form/parent/ParentForm";
import {ParentData} from "@/model/parent-data";


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
    const [child, setChild] = useState<ChildData>(selectedChild)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const router = useRouter()
    const onChildUpdated = (newChild: ChildData) => {
        setChild(newChild)
    }
    const onChildDeleted = () => {
        router.push("/children")
    }

    function handleEditClick() {
        setIsEditDialogOpen(true)
    }

    function handleDeleteClick() {
        setIsDeleteDialogOpen(true)
    }

    const [parents, setParents] = useState<{ id: string, name: string, isEmergencyContact: string }[]>([])
    useEffect(() => {
        fetchParentDetails(child)?.then(value => setParents(value))
    }, [child]);

    function fetchParentDetails(child: ChildData) {
        const parents = child.relativeParents;
        if (!parents)
            return undefined
        else
            return Promise.all(parents.map(async (parent: RelativeParent) => {
                const parentData = await getParentById(parent.id);
                return {
                    id: parentData.id,
                    name: parentData.familyName + " " + parentData.givenName,
                    isEmergencyContact: parent.isEmergencyContact ? 'check_box' : 'check_box_outline_blank',
                };
            }));
    }

    const [isAutoCompleteShown, setIsAutoCompleteShown] = useState(false)
    const [relativeParent, setRelativeParent] = useState<RelativeParent>()
    const [isParentEditDialogOpen, setParentIsEditDialogOpen] = useState(false)
    const onParentUpdated = (newParent: ParentData) => {
        console.log(newParent)
        const selectedParent = {
            id: newParent.id,
            isEmergencyContact: true
        };
        const updatedRelativeParents = child.relativeParents ? [...child.relativeParents, selectedParent] : [selectedParent];
        const updatedChild = {...child, relativeParents: updatedRelativeParents};
        setChild(updatedChild);
    }

    function changeAutoCompleteVisibility() {
        setIsAutoCompleteShown(!isAutoCompleteShown)
    }

    function handleParentEditClick() {
        setParentIsEditDialogOpen(true)
    }

    return (
        <div className={"container w-3/6 py-10 h-[100vh] overflow-auto"}>
            <div className={"flex justify-between px-6 pb-6 items-center"}>
                <Link href={"/children"}>
                    <span className="material-icons-outlined">arrow_back</span>
                </Link>
                <div>
                    Child details
                </div>
                <HoverText trigger={
                    (!child.relativeParents || child.relativeParents?.length === 0) && (
                        <AlertTriangle className={"text-yellow-600 "}/>)
                } content={"Parent not associated yet"}/>
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
                        {child.givenName} {child.familyName}
                    </div>
                </div>
                <div className="mb-6">
                    <Label>Birth date and place:</Label>
                    <div className={`${fieldAppearance} mt-2`}>
                        {format(new Date(child.birthDate), "P")} {child.birthPlace}
                    </div>
                </div>
                <div className="mb-6">
                    <Label>Address:</Label>
                    <div className={`${fieldAppearance} mt-2`}>
                        {child.address}
                    </div>
                </div>
                <div className={"flex justify-between"}>
                    <Button
                        type={"button"}
                        variant={"ghost"}
                        onClick={changeAutoCompleteVisibility}
                    >
                        {
                            isAutoCompleteShown ? (
                                <>
                                    <span>Cancel</span>
                                </>) : (
                                <>
                                    <PlusSquare/>
                                    <span>Edit parents</span>
                                </>)
                        }
                    </Button>
                    {isAutoCompleteShown &&
                        <Button onClick={() => {
                            const {hasDiagnosedDiseases, hasRegularMedicines, ...childWithoutUnnecessaryFields} = child;
                            const emergencyContacts = child.relativeParents?.filter(parent => parent.isEmergencyContact);
                            if (emergencyContacts && emergencyContacts.length === 0 && childWithoutUnnecessaryFields.relativeParents?.length !== 0) {
                                toast({
                                    title: "Error",
                                    description: "At least one parent should be marked as an emergency contact.",
                                    duration: 2000,
                                    variant: "destructive"
                                });
                            } else {
                                updateChild(childWithoutUnnecessaryFields)
                                    .then(value => {
                                        setChild(value);
                                        toast({
                                            title: "The child is successfully updated",
                                            description: `A child with name: ${child.givenName} ${child.familyName} updated`,
                                            duration: 2000
                                        });
                                        setIsAutoCompleteShown(false);
                                    })
                                    .catch(error => {
                                        console.error("Failed to update child:", error);
                                    });
                            }
                        }}>
                            Save
                        </Button>}
                </div>
                {isAutoCompleteShown ? (
                        <>
                            <Table className={"w-full border border-gray-200"}>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className={"text-left"}>Name</TableHead>
                                        <TableHead className="text-center">isEmergencyContact</TableHead>
                                        <TableHead className="w-5"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>{
                                    parents && parents.length !== 0 ? (
                                        parents.map((parent, index) => (
                                            <TableRow key={index}>
                                                <TableCell className={"text-left"}>
                                                    {parent.name}
                                                </TableCell>
                                                <TableCell className={"text-center"}>
                                                    <Button type={"button"} variant={"ghost"}
                                                            onClick={() => {
                                                                const updatedParents = child.relativeParents?.map(relative => {
                                                                    if (relative.id === parent.id) {
                                                                        return {
                                                                            ...relative,
                                                                            isEmergencyContact: !relative.isEmergencyContact
                                                                        };
                                                                    }
                                                                    return relative;
                                                                });
                                                                if (updatedParents) {
                                                                    const updatedChild = {
                                                                        ...child,
                                                                        relativeParents: updatedParents
                                                                    };
                                                                    setChild(updatedChild);
                                                                }
                                                            }}>
                                                    <span className={"material-icons-outlined"}>
                                                        {parent.isEmergencyContact}
                                                    </span>
                                                    </Button>
                                                </TableCell>
                                                <TableCell className={"text-center"}>
                                                    <Button type={"button"} className="p-0"
                                                            variant={"ghost"}
                                                            onClick={() => {
                                                                const updatedParents = child.relativeParents?.filter(value => value.id !== parent.id);
                                                                if (updatedParents) {
                                                                    const updatedChild = {
                                                                        ...child,
                                                                        relativeParents: updatedParents
                                                                    };
                                                                    setChild(updatedChild);
                                                                }
                                                            }}>
                                                        <span className="material-icons-outlined">delete</span>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))) : (
                                        <TableRow>
                                            <TableCell className={"text-center text-gray-400"} colSpan={3}>
                                                Nothing added yet
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <div className={"flex justify-between mb-5"}>
                                <AutoComplete
                                    key={0}
                                    isLoading={false}
                                    disabled={false}
                                    onValueChange={(value) => {
                                        if (value)
                                            setRelativeParent({
                                                id: value.id,
                                                isEmergencyContact: true
                                            })
                                    }}
                                    placeholder={"Select parents..."}
                                    emptyMessage={"No parent found"}
                                />
                                <Button
                                    onClick={() => {
                                        if (relativeParent) {
                                            const updatedRelativeParents = child.relativeParents ? [...child.relativeParents, relativeParent] : [relativeParent];
                                            const updatedChild = {...child, relativeParents: updatedRelativeParents};
                                            setChild(updatedChild);
                                        }
                                    }}>
                                    Add
                                </Button>
                                <Button
                                    onClick={() => {
                                        handleParentEditClick()
                                    }}>
                                    Create new parent
                                </Button>
                            </div>
                        </>) :
                    <ShowTable tableFields={["Name", "isEmergencyContact"]}
                               value={parents?.map((parent) => ({
                                   name: parent.name,
                                   isEmergencyContact: <span
                                       className="material-icons-outlined">{parent.isEmergencyContact}</span>
                               }))}
                               showDeleteButton={false}/>
                }
                <ShowTable tableFields={["Name", "Diagnosed at"]} value={child.diagnosedDiseases}
                           showDeleteButton={false}/>
                <ShowTable tableFields={["Name", "Dose", "Taken since"]} value={child.regularMedicines}
                           showDeleteButton={false}/>
            </div>
            <Toaster/>
            <ParentForm
                isOpen={isParentEditDialogOpen}
                onOpenChange={setParentIsEditDialogOpen}
                onParentModified={onParentUpdated}
            />
            <ChildForm existingChild={child ?? undefined}
                       isOpen={isEditDialogOpen}
                       onChildModified={onChildUpdated}
                       onOpenChange={setIsEditDialogOpen}
            />
            <DeleteData entityId={child.id}
                        entityLabel={`${child.givenName} ${child.familyName}`}
                        isOpen={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                        onSuccess={onChildDeleted}
                        deleteFunction={deleteChild}
                        entityType={"Child"}
            />
        </div>
    )
}