import ParentsChildrenTable from "@/table/parent/ParentsChildrenTable";
import {AutoComplete} from "@/form/AutoComplete";
import getPotentialChildren from "@/api/graphql/parent/getPotentialChildren";
import {Button} from "@/components/ui/button";
import {PlusSquare} from "lucide-react";
import React, {Dispatch, SetStateAction, useContext, useState} from "react";
import {ParentData, ParentDataWithChildren} from "@/model/parent-data";
import {ChildData} from "@/model/child-data";
import updateParent from "@/api/graphql/parent/updateParent";
import {toast} from "@/components/ui/use-toast";
import ChildForm from "@/form/child/ChildForm";
import updateChild from "@/api/graphql/child/updateChild";
import AccessTokenContext from "@/context/access-token-context";

interface ChildInEditModeProps {
    parent: ParentData
    parentWithChildren: ParentDataWithChildren
    setParentWithChildren: Dispatch<SetStateAction<ParentDataWithChildren>>
    setIsEditChildrenModeEnabled: Dispatch<SetStateAction<boolean>>

}

export default function ChildInEditMode({
                                            parent,
                                            parentWithChildren,
                                            setParentWithChildren,
                                            setIsEditChildrenModeEnabled
                                        }: ChildInEditModeProps) {
    const accessToken = useContext(AccessTokenContext)


    const [tempParentsWithChildren, setTempParentsWithChildren] = useState<ParentDataWithChildren>(parentWithChildren)
    const [selectedChildDataToAdd, setSelectedChildDataToAdd] = useState<ChildData>()

    const [isChildForm, setIsChildForm] = useState(false)

    function onChildAdded(newChild: ChildData) {
        const updatedChildren = tempParentsWithChildren.childDtos ? [...tempParentsWithChildren.childDtos, newChild] : [newChild];
        setTempParentsWithChildren({...tempParentsWithChildren, childDtos: updatedChildren})
    }

    function handleChildCreationClick() {
        setIsChildForm(true)
    }

    function onCancel() {
        setIsEditChildrenModeEnabled(false)
    }

    function updateAndSaveParent(parent: ParentDataWithChildren) {
        const {childDtos, ...others} = parent
        updateParent({
            ...others,
            childIds: childDtos?.map(child => child.id)
        }, accessToken)
            .then(value => {
                setParentWithChildren(prevState => ({...prevState, ...value}))
                toast({
                    title: "Parent is successfully updated",
                    description: `A parent with name: ${parent.givenName} ${parent.familyName} updated`,
                    duration: 2000
                });
                setIsEditChildrenModeEnabled(false);
                setParentWithChildren(tempParentsWithChildren)
            })
            .catch(error => {
                toast({
                    title: `Parent with name: ${parent.givenName} ${parent.familyName} cannot be updated updated`,
                    description: `${error.message}`,
                    duration: 2000,
                    variant: "destructive"
                });
            })
        if (childDtos) {
            childDtos.map(
                childDto => updateChild(childDto, accessToken)
            );
        }
    }

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
                    const hasEmergencyContact = tempParentsWithChildren.childDtos?.every(child => {
                        return child.relativeParents?.some(rp => rp.isEmergencyContact);
                    });
                    if (!hasEmergencyContact) {
                        toast({
                            title: "Error",
                            description: "At least one emergency contact is needed for each child.",
                            duration: 2000,
                            variant: "destructive"
                        });
                    } else {
                        updateAndSaveParent(tempParentsWithChildren);
                    }
                }}>
                    Save
                </Button>

            </div>
            <ParentsChildrenTable parent={parent}
                                  parentWithChildren={tempParentsWithChildren}
                                  setParentWithChildren={setTempParentsWithChildren}/>
            <div className={"flex justify-between mb-5 mt-3"}>
                <div className={"flex w-4/5"}>
                    <AutoComplete
                        className={"w-2/3 mr-3"}
                        getPotential={getPotentialChildren}
                        key={0}
                        getLabelForItem={(item) => `${item.givenName} ${item.familyName}`}
                        isAdded={false}
                        isLoading={false}
                        disabled={false}
                        onValueChange={(value) => {
                            setSelectedChildDataToAdd(value)
                        }}
                        placeholder={"Select children..."}
                        emptyMessage={"No child found"}
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
                        handleChildCreationClick()
                    }}>
                    Create
                </Button>
            </div>
            <ChildForm onChildModified={onChildAdded}
                       isOpen={isChildForm}
                       onOpenChange={setIsChildForm}
                       onParentFormClicked={true}
            />
        </>
    )
}