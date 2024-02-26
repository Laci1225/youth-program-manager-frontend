import {AutoComplete} from "@/form/AutoComplete";
import {Button} from "@/components/ui/button";
import {PlusSquare} from "lucide-react";
import React, {Dispatch, SetStateAction, useContext, useState} from "react";
import {ParentData, ParentDataWithEmergencyContact} from "@/model/parent-data";
import {ChildData, ChildDataWithParents, RelativeParent} from "@/model/child-data";
import {toast} from "@/components/ui/use-toast";
import updateChild from "@/api/graphql/child/updateChild";
import ChildsParentsTable from "@/table/child/ChildsParentsTable";
import getPotentialParents from "@/api/graphql/child/getPotentialParents";
import ParentForm from "@/form/parent/ParentForm";
import fromChildWithParentsToChildData from "@/model/fromChildWithParentsToChildData";
import AccessTokenContext from "@/context/access-token-context";

interface ParentInEditModeProps {
    child: ChildData
    childWithParents: ChildDataWithParents
    setChildWithParents: Dispatch<SetStateAction<ChildDataWithParents>>
    setIsEditParentsModeEnabled: Dispatch<SetStateAction<boolean>>
}

export default function ParentInEditMode({
                                             child,
                                             childWithParents,
                                             setChildWithParents,
                                             setIsEditParentsModeEnabled
                                         }: ParentInEditModeProps) {
    const accessToken = useContext(AccessTokenContext)
    const [tempChildWithParents, setTempChildWithParents] = useState<ChildDataWithParents>(childWithParents)
    const [selectedParentDataToAdd, setSelectedParentDataToAdd] = useState<ParentData>()

    const [isParentForm, setIsParentForm] = useState(false)

    const onParentAdded = (newParent: ParentData) => {
        const newParentData: ParentDataWithEmergencyContact = {
            parentDto: newParent,
            isEmergencyContact: true
        };
        const updatedParents = tempChildWithParents.parents ? [...tempChildWithParents.parents, newParentData] : [newParentData];
        setChildWithParents({...tempChildWithParents, parents: updatedParents})
    }

    function handleParentCreationClick() {
        setIsParentForm(true)
    }

    function onCancel() {
        setIsEditParentsModeEnabled(false)
    }

    function updateAndSaveChild(child: Omit<ChildData, "hasRegularMedicines" | "modifiedDate" | "createdDate" | "hasDiagnosedDiseases">) {
        updateChild(
            child, accessToken
        )
            .then(value => {
                setChildWithParents(prevState => ({...prevState, ...value}))
                toast({
                    title: "Parent is successfully updated",
                    description: `A parent with name: ${child.givenName} ${child.familyName} updated`,
                    duration: 2000
                });
                setIsEditParentsModeEnabled(false);
            })
            .catch(error => {
                toast({
                    title: `Child with name: ${child.givenName} ${child.familyName} cannot be updated updated`,
                    description: `${error.message}`,
                    duration: 2000,
                    variant: "destructive"
                });
            })
            .then(() => setChildWithParents(tempChildWithParents))
    }

    function addParentToChild() {
        if (!selectedParentDataToAdd) return;
        setParentAddedSuccessfully(true)
        setSelectedParentDataToAdd(undefined)
        const isParentAlreadyAdded = child.relativeParents?.some(
            (parent) => parent.id === selectedRelativeParentToAdd?.id
        );

        if (!isParentAlreadyAdded && selectedRelativeParentToAdd) {
            setSelectedRelativeParentToAdd({id: selectedRelativeParentToAdd.id, isEmergencyContact: true});
            const updatedParents = tempChildWithParents.parents ?? [];
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

    const [selectedRelativeParentToAdd, setSelectedRelativeParentToAdd] = useState<RelativeParent>()

    const [parentAddedSuccessfully, setParentAddedSuccessfully] = useState(false)

    return (
        <>
            <div className={"flex justify-between mb-5"}>
                <Button
                    type={"button"}
                    variant={"ghost"}
                    onClick={onCancel}
                >
                    <span>Cancel</span>
                </Button>
                <Button onClick={() => {
                    const {
                        hasDiagnosedDiseases,
                        hasRegularMedicines,
                        createdDate,
                        modifiedDate,
                        ...childWithoutUnnecessaryFields
                    } = fromChildWithParentsToChildData(tempChildWithParents);
                    const emergencyContacts = childWithoutUnnecessaryFields.relativeParents?.filter(parent => parent.isEmergencyContact);
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
                </Button>

            </div>
            <ChildsParentsTable child={child}
                                childWithParents={tempChildWithParents}
                                setChildWithParents={setTempChildWithParents}/>
            <div className={"flex justify-between mb-5 mt-3"}>
                <div className={"flex w-4/5"}>
                    <AutoComplete
                        className={"w-2/3 mr-3"}
                        getPotential={getPotentialParents}
                        alreadyAddedData={child.relativeParents}
                        getLabelForItem={(item) => `${item.givenName} ${item.familyName}`}
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
                        handleParentCreationClick()
                    }}>
                    Create
                </Button>
            </div>
            <ParentForm onParentModified={onParentAdded}
                        isOpen={isParentForm}
                        onOpenChange={setIsParentForm}
                        onChildFormClicked={true}
            />
        </>
    )
}