import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import React, {useState} from "react";
import Link from "next/link";
import {Toaster} from "@/components/ui/toaster";
import {Label} from "@/components/ui/label";
import {fieldAppearance} from "@/components/fieldAppearance";
import {Pencil, PlusSquare, Trash} from "lucide-react";
import {useRouter} from "next/router";
import ParentForm from "@/form/parent/ParentForm";
import {serverSideClient} from "@/api/graphql/client";
import getParentById from "@/api/graphql/parent/getParentById";
import deleteParent from "@/api/graphql/parent/deleteParent";
import DeleteData from "@/components/deleteData";
import {
    ParentData,
    ParentDataWithChildren,
    ParentDataWithChildrenIds,
    ParentDataWithEmergencyContact
} from "@/model/parent-data";
import {AutoComplete} from "@/table/AutoComplete";
import getPotentialParents from "@/api/graphql/child/getPotentialParents";
import {Button} from "@/components/ui/button";
import ShowTable from "@/form/ShowTable";
import fromParentWithChildrenToParent from "@/model/fromParentWithChildrenToParent";
import ChildsParentsTable from "@/table/child/ChildsParentsTable";
import ParentsChidrenTable from "@/table/parent/ParentsChidrenTable";
import SaveParentsDataToChild from "@/table/child/SaveParentsDataToChild";
import getChildById from "@/api/graphql/child/getChildById";
import SaveChildrenDataToParent from "@/table/parent/SaveChildrenDataToParent";
import {ChildData} from "@/model/child-data";
import updateChild from "@/api/graphql/child/updateChild";
import {toast} from "@/components/ui/use-toast";
import updateParent from "@/api/graphql/parent/updateParent";
import getPotentialChildren from "@/api/graphql/parent/getPotentialChildren";
import ChildForm from "@/form/child/ChildForm";


export const getServerSideProps = (async (context) => {
    let parentData;
    if (context.params?.parentId) {
        try {
            parentData = await getParentById(context.params.parentId, serverSideClient);
            console.log(parentData)
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
}) satisfies GetServerSideProps<{ selectedParent: ParentDataWithChildren }, { parentId: string }>;
export default function Parent({selectedParent}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [parentWithChildren, setParentWithChildren] = useState<ParentDataWithChildren>(selectedParent)
    const parent: ParentData = fromParentWithChildrenToParent(parentWithChildren)
    const [isParentEditDialogOpen, setIsParentEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const router = useRouter()
    const onParentUpdated = (newParent: ParentData) => {
        setParentWithChildren((prevState) => ({...prevState, ...newParent}))
    }
    const onParentDeleted = () => {
        router.push("/parents")
    }

    function onEditClicked() {
        setIsEditChildrenModeEnabled(!isEditChildrenModeEnabled)
        setIsEditModeBorderVisible(!isEditModeBorderVisible)
    }

    function onCancelClicked() {
        getParentById(parent.id)
            .then(value => setParentWithChildren(value))
        setIsEditChildrenModeEnabled(!isEditChildrenModeEnabled)
        setIsEditModeBorderVisible(!isEditModeBorderVisible)
    }

    function handleEditClick() {
        setIsParentEditDialogOpen(true)
    }

    function handleDeleteClick() {
        setIsDeleteDialogOpen(true)
    }

    const [isEditChildrenModeEnabled, setIsEditChildrenModeEnabled] = useState(false)
    const [isEditModeBorderVisible, setIsEditModeBorderVisible] = useState(false)

    const [isChildForm, setIsChildForm] = useState(false)

    function updateAndSaveParent(parent: ParentDataWithChildren) {
        console.log(parent)
        const {childDtos, ...others} = parent
        updateParent({
            ...others,
            childIds: parent.childDtos?.map(child => child.id)
        })
            .then(value => {
                setParentWithChildren(prevState => ({...prevState, ...value}))
                toast({
                    title: "Parent is successfully updated",
                    description: `A parent with name: ${parent.givenName} ${parent.familyName} updated`,
                    duration: 2000
                });
                setIsEditChildrenModeEnabled(false);
            })
            .catch(error => {
                toast({
                    title: `Child with name: ${parent.givenName} ${parent.familyName} cannot be updated updated`,
                    description: `${error.message}`,
                    duration: 2000,
                    variant: "destructive"
                });
            })
            .then(() =>
                getParentById(parent.id)
                    .then(value => setParentWithChildren(value))
            )
    }

    const [selectedChildDataToAdd, setSelectedChildDataToAdd] = useState<ChildData>()

    function onChildAdded(newChild: ChildData) {
        const updatedChildren = parentWithChildren.childDtos ? [...parentWithChildren.childDtos, newChild] : [newChild];
        setParentWithChildren({...parentWithChildren, childDtos: updatedChildren})
    }

    function handleChildEditClick() {
        setIsChildForm(true)
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
                <div
                    className={`mb-6 ${isEditModeBorderVisible && "border border-dashed border-gray-400  p-2 rounded"}`}>
                    <SaveChildrenDataToParent parentWithChildren={parentWithChildren}
                                              onEdit={onEditClicked}
                                              isAutoCompleteShown={isEditChildrenModeEnabled}
                                              updateAndSaveParent={updateAndSaveParent}
                                              onCancel={onCancelClicked}/>
                    {isEditChildrenModeEnabled ? (
                            <>
                                <ParentsChidrenTable parent={parent}
                                                     parentWithChildren={parentWithChildren}
                                                     setParentWithChidren={setParentWithChildren}/>
                                <div className={"flex justify-between mb-5 mt-3"}>
                                    <div className={"flex w-4/5"}>
                                        <AutoComplete
                                            className={"w-2/3 mr-3"}
                                            getPotential={getPotentialChildren}
                                            key={0}
                                            isAdded={false}
                                            isLoading={false}
                                            disabled={false}
                                            onValueChange={(value) => {
                                                //if (value)
                                                //setSelectedRelativeParentToAdd({id: value.id, isEmergencyContact: true})
                                                setSelectedChildDataToAdd(value)
                                            }}
                                            placeholder={"Select parents..."}
                                            emptyMessage={"No parent found"}
                                        />
                                        <Button
                                            onClick={() => {
                                                if (selectedChildDataToAdd)
                                                    onChildAdded(selectedChildDataToAdd)
                                            }}>
                                            <><PlusSquare/> Add</>
                                        </Button>
                                    </div>
                                    <Button
                                        onClick={() => {
                                            handleChildEditClick()
                                        }}>
                                        Create
                                    </Button>
                                </div>
                            </>) :
                        <ShowTable tableFields={["Name", "isEmergencyContact"]}
                                   value={parentWithChildren.childDtos?.map((child) => ({
                                       name: child.givenName + " " + child.familyName,
                                       birthData: child.birthDate
                                   }))}
                                   showDeleteButton={false}/>
                    }
                </div>
                <div className="mb-6">
                    <Label>Address:</Label>
                    <div className={`${fieldAppearance} mt-2`}>
                        {parent.address ?? <div className={"text-gray-400"}>Not added yet </div>}
                    </div>
                </div>
            </div>
            <Toaster/>
            <ParentForm existingParent={{
                ...parentWithChildren,
                childIds: parentWithChildren.childDtos?.map(child => child.id)
            } ?? undefined}
                        isOpen={isParentEditDialogOpen}
                        onParentModified={onParentUpdated}
                        onOpenChange={setIsParentEditDialogOpen}
            />
            <ChildForm onChildModified={onChildAdded}
                       isOpen={isChildForm}
                       onOpenChange={setIsChildForm}
                       onParentFormClicked={true}
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