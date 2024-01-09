import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {ChildData, ChildDataWithParents, RelativeParent} from "@/model/child-data";
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
import {AutoComplete} from "@/table/AutoComplete";
import {Button} from "@/components/ui/button";
import updateChild from "@/api/graphql/child/updateChild";
import {toast} from "@/components/ui/use-toast";
import HoverText from "@/components/hoverText";
import ParentForm from "@/form/parent/ParentForm";
import {ParentData, ParentDataWithEmergencyContact} from "@/model/parent-data";
import SaveParentsDataToChild from "@/table/child/SaveParentsDataToChild";
import ChildsParentsTable from "@/table/child/ChildsParentsTable";
import fromChildWithParentsToChildData from "@/model/fromChildWithParentsToChildData";
import getPotentialParents from "@/api/graphql/child/getPotentialParents";


export const getServerSideProps = (async (context) => {
    let childData;
    if (context.params?.childId) {
        try {
            childData = await getChildById(context.params.childId, serverSideClient);
            return {
                props: {selectedChildData: childData}
            }
        } catch (error) {
            return {notFound: true};
        }
    }
    return {notFound: true};
}) satisfies GetServerSideProps<{ selectedChildData: ChildDataWithParents }, { childId: string }>;
export default function Child({selectedChildData}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()
    const [childWithParents, setChildWithParents] = useState<ChildDataWithParents>(selectedChildData)
    const currentChild: ChildData = fromChildWithParentsToChildData(childWithParents);

    const onChildUpdated = (newChild: ChildData) => {
        setChildWithParents((prevState) => ({...prevState, ...newChild}))
    }
    const onChildDeleted = () => {
        router.push("/children")
    }

    const [isChildEditModeEnabled, setIsChildEditModeEnabled] = useState(false)
    const [isDeleteModeEnabled, setIsDeleteModeEnabled] = useState(false)

    function handleEditClick() {
        setIsChildEditModeEnabled(true)
    }

    function handleDeleteClick() {
        setIsDeleteModeEnabled(true)
    }

    const [isParentEditDialogOpen, setParentEditDialogOpen] = useState(false)
    const onParentAdded = (newParent: ParentData) => {
        const newParentData: ParentDataWithEmergencyContact = {
            parentDto: newParent,
            isEmergencyContact: true
        };
        const updatedParents = childWithParents.parents ? [...childWithParents.parents, newParentData] : [newParentData];
        setChildWithParents({...childWithParents, parents: updatedParents})
    }


    const [isEditParentsModeEnabled, setIsEditParentsModeEnabled] = useState(false)
    const [selectedRelativeParentToAdd, setSelectedRelativeParentToAdd] = useState<RelativeParent>()
    const [selectedParentDataToAdd, setSelectedParentDataToAdd] = useState<ParentData>()
    const [isEditModeBorderVisible, setIsEditModeBorderVisible] = useState(false)
    const [parentAddedSuccessfully, setParentAddedSuccessfully] = useState(false)

    function onEditClicked() {
        setIsEditParentsModeEnabled(!isEditParentsModeEnabled)
        setIsEditModeBorderVisible(!isEditModeBorderVisible)
    }

    function onCancelClicked() {
        getChildById(currentChild.id)
            .then(value => setChildWithParents(value))
        setIsEditParentsModeEnabled(!isEditParentsModeEnabled)
        setIsEditModeBorderVisible(!isEditModeBorderVisible)
    }


    function handleParentEditClick() {
        setParentEditDialogOpen(true)
    }

    function updateAndSaveChild(childWithoutUnnecessaryFields: Omit<ChildData, "hasRegularMedicines" | "modifiedDate" | "createdDate" | "hasDiagnosedDiseases">) {
        updateChild(childWithoutUnnecessaryFields)
            .then(value => {
                setChildWithParents(prevState => ({...prevState, ...value}))
                toast({
                    title: "Child is successfully updated",
                    description: `A child with name: ${currentChild.givenName} ${currentChild.familyName} updated`,
                    duration: 2000
                });
                setIsEditParentsModeEnabled(false);
            })
            .catch(error => {
                toast({
                    title: `Child with name: ${currentChild.givenName} ${currentChild.familyName} cannot be updated updated`,
                    description: `${error.message}`,
                    duration: 2000,
                    variant: "destructive"
                });
            })
            .then(() =>
                getChildById(currentChild.id)
                    .then(value => setChildWithParents(value))
            )
    }

    function addParentToChild() {
        if (!selectedParentDataToAdd) return;
        setParentAddedSuccessfully(true)
        setSelectedParentDataToAdd(undefined)
        const isParentAlreadyAdded = currentChild.relativeParents?.some(
            (parent) => parent.id === selectedRelativeParentToAdd?.id
        );

        if (!isParentAlreadyAdded && selectedRelativeParentToAdd) {
            setSelectedRelativeParentToAdd({id: selectedRelativeParentToAdd.id, isEmergencyContact: true});
            const updatedParents = childWithParents.parents || [];
            updatedParents.push({
                parentDto: selectedParentDataToAdd,
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
                    (!currentChild.relativeParents || currentChild.relativeParents?.length === 0) && (
                        <div className={"flex"}>
                            <AlertTriangle className={"text-yellow-600 "}/>
                            Parent not associated yet
                        </div>)
                }/>
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
                        {currentChild.givenName} {currentChild.familyName}
                    </div>
                </div>
                <div className="mb-6">
                    <Label>Birth date and place:</Label>
                    <div className={`${fieldAppearance} mt-2`}>
                        {format(new Date(currentChild.birthDate), "P")} {currentChild.birthPlace}
                    </div>
                </div>
                <div className="mb-6">
                    <Label>Address:</Label>
                    <div className={`${fieldAppearance} mt-2`}>
                        {currentChild.address}
                    </div>
                </div>
                <div
                    className={`mb-6 ${isEditModeBorderVisible && "border border-dashed border-gray-400  p-2 rounded"}`}>
                    <SaveParentsDataToChild child={currentChild}
                                            onEdit={onEditClicked}
                                            isAutoCompleteShown={isEditParentsModeEnabled}
                                            updateAndSaveChild={updateAndSaveChild}
                                            onCancel={onCancelClicked}/>
                    {isEditParentsModeEnabled ? (
                            <>
                                <ChildsParentsTable child={currentChild}
                                                    childWithParents={childWithParents}
                                                    setChildWithParents={setChildWithParents}/>
                                <div className={"flex justify-between mb-5 mt-3"}>
                                    <div className={"flex w-4/5"}>
                                        <AutoComplete
                                            className={"w-2/3 mr-3"}
                                            getPotential={getPotentialParents}
                                            alreadyAddedData={currentChild.relativeParents}
                                            key={0}
                                            isAdded={parentAddedSuccessfully}
                                            isLoading={false}
                                            disabled={false}
                                            onValueChange={(value) => {
                                                if (value)
                                                    setSelectedRelativeParentToAdd({id: value.id, isEmergencyContact: true})
                                                setSelectedParentDataToAdd(value)
                                            }}
                                            placeholder={"Select parents..."}
                                            emptyMessage={"No parent found"}
                                        />
                                        <Button
                                            disabled={!selectedParentDataToAdd}
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
                <ShowTable className={"mb-6"} tableFields={["Name", "Diagnosed at"]}
                           value={currentChild.diagnosedDiseases}
                           showDeleteButton={false}/>
                <ShowTable tableFields={["Name", "Dose", "Taken since"]}
                           value={currentChild.regularMedicines}
                           showDeleteButton={false}/>
            </div>
            <Toaster/>
            <ParentForm
                isOpen={isParentEditDialogOpen}
                onOpenChange={setParentEditDialogOpen}
                onParentModified={onParentAdded}
                onChildFormClicked={true}

            />
            <ChildForm existingChild={currentChild ?? undefined}
                       isOpen={isChildEditModeEnabled}
                       onChildModified={onChildUpdated}
                       onOpenChange={setIsChildEditModeEnabled}
            />
            <DeleteData entityId={currentChild.id}
                        entityLabel={`${currentChild.givenName} ${currentChild.familyName}`}
                        isOpen={isDeleteModeEnabled}
                        onOpenChange={setIsDeleteModeEnabled}
                        onSuccess={onChildDeleted}
                        deleteFunction={deleteChild}
                        entityType={"Child"}
            />
        </div>
    )
}