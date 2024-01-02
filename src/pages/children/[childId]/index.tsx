import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {ChildData, ChildDataInput, ChildDataWithParents, RelativeParent} from "@/model/child-data";
import getChildById from "@/api/graphql/child/getChildById";
import React, {useState} from "react";
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
import {AutoComplete} from "@/form/child/AutoComplete";
import {Button} from "@/components/ui/button";
import updateChild from "@/api/graphql/child/updateChild";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {toast} from "@/components/ui/use-toast";
import HoverText from "@/components/hoverText";
import ParentForm from "@/form/parent/ParentForm";
import {ParentData, ParentDataWithEmergencyContact} from "@/model/parent-data";


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
}) satisfies GetServerSideProps<{ selectedChild: ChildDataWithParents }, { childId: string }>;
export default function Child({selectedChild}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [childWithParents, setChildWithParents] = useState<ChildDataWithParents>(selectedChild)
    const child: ChildData = {
        id: childWithParents.id,
        familyName: childWithParents.familyName,
        givenName: childWithParents.givenName,
        birthDate: childWithParents.birthDate,
        birthPlace: childWithParents.birthPlace,
        address: childWithParents.address,
        relativeParents: childWithParents.parents?.map(value => ({
            id: value.parentDto.id,
            isEmergencyContact: value.isEmergencyContact,
        })) || [],
        diagnosedDiseases: childWithParents.diagnosedDiseases,
        regularMedicines: childWithParents.regularMedicines,
        createdDate: childWithParents.createdDate,
        modifiedDate: childWithParents.modifiedDate,
        hasDiagnosedDiseases: childWithParents.hasDiagnosedDiseases,
        hasRegularMedicines: childWithParents.hasRegularMedicines
    };
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const router = useRouter()
    const onChildUpdated = (newChild: ChildData) => {
        setChildWithParents((prevState) => ({...prevState, childDto: newChild}))
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

    const [inputChild, setInputChild] = useState<ChildDataInput>()

    const [isAutoCompleteShown, setIsAutoCompleteShown] = useState(false)
    const [relativeParent, setRelativeParent] = useState<RelativeParent>()
    const [parent, setParent] = useState<ParentData>()
    const [isParentEditDialogOpen, setParentIsEditDialogOpen] = useState(false)
    const onParentUpdated = (newParent: ParentData) => {
        const selectedParent = {
            id: newParent.id,
            isEmergencyContact: true
        };
        setChildWithParents({...childWithParents, parents: undefined})
        //const updatedRelativeParents = child.relativeParents ? [...child.relativeParents, selectedParent] : [selectedParent];
        //const updatedChild = {...child, relativeParents: updatedRelativeParents};
        //setChild(updatedChild);
    }

    const [editBorderShown, setEditBorderShown] = useState(false)

    function changeAutoCompleteVisibility() {
        setIsAutoCompleteShown(!isAutoCompleteShown)
        setEditBorderShown(!editBorderShown)
    }

    function handleParentEditClick() {
        setParentIsEditDialogOpen(true)
    }

    function updateAndSaveChild(childWithoutUnnecessaryFields: Omit<ChildData, "hasRegularMedicines" | "modifiedDate" | "createdDate" | "hasDiagnosedDiseases">) {
        updateChild(childWithoutUnnecessaryFields)
            .then(value => {
                setChildWithParents(prevState => ({...prevState, childDto: value}))
                toast({
                    title: "The child is successfully updated",
                    description: `A child with name: ${child.givenName} ${child.familyName} updated`,
                    duration: 2000
                });
                setIsAutoCompleteShown(false);
            })
            .catch(error => {
                toast({
                    title: `Child with name: ${child.givenName} ${child.familyName} cannot be updated updated`,
                    description: `${error.message}`,
                    duration: 2000,
                    variant: "destructive"
                });
            })
            .then(() =>
                getChildById(child.id)
                    .then(value => setChildWithParents(value))
            )
    }

    function deleteChildData(parent: ParentDataWithEmergencyContact) {
        const updatedParents = child.relativeParents?.filter(value => value.id !== parent.parentDto.id);
        const updated2 = childWithParents.parents?.filter(value => value.parentDto.id !== parent.parentDto.id)
        /*if (updated2) {
            const updatedChild = {
                ...child,
                relativeParents: updatedParents
            };*/
        setChildWithParents(prevState => ({...prevState, parents: updated2}))
        //}
    }

    const setRelativeParents = (newParent: ParentData) => {
        const isParentAlreadyAdded = child.relativeParents?.some(
            (parent) => parent.id === newParent.id
        );

        if (!isParentAlreadyAdded) {
            setRelativeParent({id: newParent.id, isEmergencyContact: true})
        } else {
            toast({
                title: "Parent already added",
                description: `${newParent.givenName} ${newParent.familyName} is already associated with this child.`,
                duration: 2000,
                variant: "destructive"
            });
        }
    };


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
                <div className={`mb-6 ${editBorderShown && "border border-dashed border-gray-400  p-2 rounded"}`}>
                    <div className={"flex justify-between mb-5"}>
                        <Button
                            type={"button"}
                            variant={"ghost"}
                            onClick={changeAutoCompleteVisibility}
                        >
                            {
                                isAutoCompleteShown ? (
                                    <span>Cancel</span>) : (
                                    <>
                                        <Pencil/>
                                        <span>Edit parents</span>
                                    </>)
                            }
                        </Button>
                        {isAutoCompleteShown &&
                            <Button onClick={() => {
                                const {
                                    hasDiagnosedDiseases,
                                    hasRegularMedicines,
                                    createdDate,
                                    modifiedDate,
                                    ...childWithoutUnnecessaryFields
                                } = child;
                                const emergencyContacts = child.relativeParents?.filter(parent => parent.isEmergencyContact);
                                if (emergencyContacts && emergencyContacts.length === 0 && childWithoutUnnecessaryFields.relativeParents?.length !== 0) {
                                    toast({
                                        title: "Error",
                                        description: "At least one parent should be marked as an emergency contact.",
                                        duration: 2000,
                                        variant: "destructive"
                                    });
                                } else {
                                    updateAndSaveChild(childWithoutUnnecessaryFields);
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
                                        childWithParents.parents && childWithParents.parents.length !== 0 ? (
                                            childWithParents.parents.map((parent, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className={"text-left"}>
                                                        {parent.parentDto.givenName} {parent.parentDto.familyName}
                                                    </TableCell>
                                                    <TableCell className={"text-center"}>
                                                        <Button
                                                            type={"button"}
                                                            variant={"ghost"}
                                                            onClick={() => {
                                                                const updatedParents = child.relativeParents?.map(relative => {
                                                                    if (relative.id === parent.parentDto.id) {
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
                                                                    setChildWithParents(prevState => ({
                                                                        ...prevState,
                                                                        childDto: updatedChild,
                                                                        parents: prevState.parents?.map(relative => {
                                                                            if (relative.parentDto.id === parent.parentDto.id) {
                                                                                return {
                                                                                    ...relative,
                                                                                    isEmergencyContact: !relative.isEmergencyContact
                                                                                };
                                                                            }
                                                                            return relative;
                                                                        })
                                                                    }));
                                                                }
                                                            }}
                                                        >
                                                        <span className={"material-icons-outlined"}>
                                                            {parent.isEmergencyContact ? 'check_box' : 'check_box_outline_blank'}
                                                        </span>
                                                        </Button>
                                                    </TableCell>

                                                    <TableCell className={"text-center"}>
                                                        <Button type={"button"} className="p-0"
                                                                variant={"ghost"}
                                                                onClick={() => {
                                                                    deleteChildData(parent);
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
                                <div className={"flex justify-between mb-5 mt-3"}>
                                    <div className={"flex w-4/5"}>
                                        <AutoComplete
                                            className={"w-2/3 mr-3"}
                                            relativeParents={child.relativeParents}
                                            key={0}
                                            isLoading={false}
                                            disabled={false}
                                            onValueChange={(value) => {
                                                if (value)
                                                    setRelativeParents(value)
                                                setParent(value)
                                            }}
                                            placeholder={"Select parents..."}
                                            emptyMessage={"No parent found"}
                                        />
                                        <Button
                                            disabled={!parent}
                                            onClick={() => {
                                                if (relativeParent) {
                                                    const isParentAlreadyAdded = child.relativeParents?.some(
                                                        (parent) => parent.id === relativeParent.id
                                                    );

                                                    if (!isParentAlreadyAdded) {
                                                        setRelativeParent({id: relativeParent.id, isEmergencyContact: true})
                                                        const updatedRelativeParents = child.relativeParents ? [...child.relativeParents, relativeParent] : [relativeParent];
                                                        const updatedChild = {
                                                            ...child,
                                                            relativeParents: updatedRelativeParents
                                                        };

                                                        const updatedParents = childWithParents.parents || [];
                                                        if (parent) {
                                                            updatedParents.push({
                                                                parentDto: parent,
                                                                isEmergencyContact: true
                                                            });
                                                        }
                                                        setChildWithParents(prevState => ({
                                                            ...prevState,
                                                            parents: updatedParents
                                                        }))
                                                    } else {
                                                        toast({
                                                            title: "Parent already added",
                                                            duration: 2000,
                                                            variant: "destructive"
                                                        });
                                                    }

                                                }

                                            }}>
                                            <><PlusSquare/> Add</>
                                        </Button>
                                    </div>
                                    <Button
                                        onClick={() => {
                                            handleParentEditClick()
                                        }}>
                                        Create
                                    </Button>
                                </div>
                            </>) :
                        <ShowTable tableFields={["Name", "isEmergencyContact"]}
                                   value={childWithParents.parents?.map((parent) => ({
                                       name: parent.parentDto.givenName + " " + parent.parentDto.familyName,
                                       isEmergencyContact: <span
                                           className="material-icons-outlined">{parent.isEmergencyContact ? 'check_box' : 'check_box_outline_blank'}</span>
                                   }))}
                                   showDeleteButton={false}/>
                    }
                </div>
                <ShowTable className={"mb-6"} tableFields={["Name", "Diagnosed at"]} value={child.diagnosedDiseases}
                           showDeleteButton={false}/>
                <ShowTable tableFields={["Name", "Dose", "Taken since"]}
                           value={child.regularMedicines}
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