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
import SaveParentsDataToChild from "@/table/child/SaveParentsDataToChild";
import ChildsParentTable from "@/table/child/ChildsParentTable";


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

    const [isAutoCompleteShown, setIsAutoCompleteShown] = useState(false)
    const [autocompleteRelativeParent, setAutocompleteRelativeParent] = useState<RelativeParent>()
    const [autocompleteParent, setAutocompleteParent] = useState<ParentData>()
    const [isParentEditDialogOpen, setParentIsEditDialogOpen] = useState(false)
    const onParentAdded = (newParent: ParentData) => {
        const newParentData: ParentDataWithEmergencyContact = {
            parentDto: newParent,
            isEmergencyContact: true
        };
        const updatedParents = childWithParents.parents ? [...childWithParents.parents, newParentData] : [newParentData];
        setChildWithParents({...childWithParents, parents: updatedParents})
    }

    const [editBorderShown, setEditBorderShown] = useState(false)

    function onEditClicked() {
        setIsAutoCompleteShown(!isAutoCompleteShown)
        setEditBorderShown(!editBorderShown)
    }

    function onCancelClicked() {
        getChildById(child.id)
            .then(value => setChildWithParents(value))
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

    function addParentToChild() {
        if (!autocompleteParent) return;
        setIsParentAdded(true)
        setAutocompleteParent(undefined)
        const isParentAlreadyAdded = child.relativeParents?.some(
            (parent) => parent.id === autocompleteRelativeParent?.id
        );

        if (!isParentAlreadyAdded && autocompleteRelativeParent) {
            setAutocompleteRelativeParent({id: autocompleteRelativeParent.id, isEmergencyContact: true});
            const updatedParents = childWithParents.parents || [];
            updatedParents.push({
                parentDto: autocompleteParent,
                isEmergencyContact: true,
            });
            setChildWithParents((prevState) => ({
                ...prevState,
                parents: updatedParents,
            }));
        } else {
            toast({
                title: "Parent already added",
                duration: 2000,
                variant: "destructive",
            });
        }
    }

    const [isParentAdded, setIsParentAdded] = useState(false)
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
                    <SaveParentsDataToChild child={child}
                                            onEdit={onEditClicked}
                                            isAutoCompleteShown={isAutoCompleteShown}
                                            updateAndSaveChild={updateAndSaveChild}
                                            onCancel={onCancelClicked}/>
                    {isAutoCompleteShown ? (
                            <>
                                <ChildsParentTable child={child}
                                                   childWithParents={childWithParents}
                                                   setChildWithParents={setChildWithParents}/>
                                <div className={"flex justify-between mb-5 mt-3"}>
                                    <div className={"flex w-4/5"}>
                                        <AutoComplete
                                            className={"w-2/3 mr-3"}
                                            relativeParents={child.relativeParents}
                                            key={0}
                                            isAdded={isParentAdded}
                                            isLoading={false}
                                            disabled={false}
                                            onValueChange={(value) => {
                                                if (value)
                                                    setAutocompleteRelativeParent({id: value.id, isEmergencyContact: true})
                                                setAutocompleteParent(value)
                                            }}
                                            placeholder={"Select parents..."}
                                            emptyMessage={"No parent found"}
                                        />
                                        <Button
                                            disabled={!autocompleteParent}
                                            onClick={addParentToChild}>
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
                onParentModified={onParentAdded}
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