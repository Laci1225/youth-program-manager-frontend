import {InferGetServerSidePropsType} from "next";
import {ChildData, ChildDataWithParents} from "@/model/child-data";
import getChildById from "@/api/graphql/child/getChildById";
import React, {useContext, useEffect, useState} from "react";
import ChildForm from "@/form/child/ChildForm";
import Link from "next/link";
import {format} from "date-fns";
import {Toaster} from "@/components/ui/toaster";
import ShowTable from "@/form/ShowTable";
import {Label} from "@/components/ui/label";
import {fieldAppearance} from "@/components/fieldAppearance";
import {serverSideClient} from "@/api/graphql/client";
import {useRouter} from "next/router";
import {AlertTriangle, Pencil, Trash} from "lucide-react";
import DeleteData from "@/components/deleteData";
import deleteChild from "@/api/graphql/child/deleteChild";
import HoverText from "@/components/hoverText";
import {ParentDataWithEmergencyContact} from "@/model/parent-data";
import SaveParentsDataToChild from "@/table/child/SaveParentsDataToChild";
import fromChildWithParentsToChildData from "@/model/fromChildWithParentsToChildData";
import ParentInEditMode from "@/table/child/ParentInEditMode";
import {cn} from "@/lib/utils";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {getSession, withPageAuthRequired} from "@auth0/nextjs-auth0";
import AccessTokenContext from "@/context/access-token-context";
import jwt from "jsonwebtoken";
import PermissionContext from "@/context/permission-context";
import {DELETE_CHILDREN, READ_CHILDREN, UPDATE_CHILDREN, UPDATE_PARENTS} from "@/constants/auth0-permissions";

export const getServerSideProps = withPageAuthRequired<{
    selectedChildData: ChildDataWithParents, accessToken: string, permissions: string[]
}, {
    childId: string
}>({
    async getServerSideProps(context) {
        let childData;
        if (context.params?.childId) {
            try {
                const session = await getSession(context.req, context.res);
                childData = await getChildById(context.params.childId, session?.accessToken, serverSideClient);
                const claims = jwt.decode(session?.accessToken!) as jwt.JwtPayload;
                const permissions = claims["permissions"] as string[];
                if (permissions.includes(READ_CHILDREN))
                    return {
                        props: {
                            selectedChildData: childData,
                            accessToken: session!.accessToken!,
                            permissions: permissions,
                        }
                    }
                else {
                    return {
                        notFound: true
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
    }
})
export default function Child({
                                  selectedChildData,
                                  accessToken,
                                  permissions
                              }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const {setPermissions} = useContext(PermissionContext)
    const router = useRouter()
    const [childWithParents, setChildWithParents] = useState<ChildDataWithParents>(selectedChildData)
    const currentChild: ChildData = fromChildWithParentsToChildData(childWithParents);
    useEffect(() => {
        setPermissions(permissions)
    }, [permissions, setPermissions]);
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

    const [isEditParentsModeEnabled, setIsEditParentsModeEnabled] = useState(false)
    const [isEditModeBorderVisible, setIsEditModeBorderVisible] = useState(false)

    function onEditClicked() {
        setIsEditParentsModeEnabled(!isEditParentsModeEnabled)
        setIsEditModeBorderVisible(!isEditModeBorderVisible)
    }

    return (
        <AccessTokenContext.Provider value={accessToken}>
            <div className="container w-3/6 py-10 h-[85vh] overflow-auto">
                <div className="flex justify-between px-6 pb-6 items-center">
                    <Link href="/children">
                        <span className="material-icons-outlined">arrow_back</span>
                    </Link>
                    <div>
                        Child details
                    </div>
                    <HoverText>
                        {
                            (!currentChild.relativeParents?.length) && (
                                <div className="flex">
                                    <AlertTriangle className="text-yellow-600"/>
                                    Parent not associated yet
                                </div>)
                        }
                    </HoverText>
                    <div className="flex">
                        {
                            permissions.includes(UPDATE_CHILDREN) && (
                                <div className="flex flex-row items-center hover:cursor-pointer px-5"
                                     onClick={(event) => {
                                         event.preventDefault()
                                         handleEditClick()
                                     }}>
                                    <Pencil className="mx-1"/>
                                    <span>Edit</span>
                                </div>)
                        }
                        {
                            permissions.includes(DELETE_CHILDREN) && (
                                <div
                                    className="flex flex-row items-center hover:cursor-pointer rounded p-2 mx-5 bg-red-600 text-white"
                                    onClick={(event) => {
                                        event.preventDefault()
                                        handleDeleteClick()
                                    }}>
                                    <Trash className="mx-1"/>
                                    <span>Delete</span>
                                </div>)
                        }
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
                        className={cn(`mb-6`, isEditModeBorderVisible && "border border-dashed border-gray-400  p-2 rounded")}>
                        {
                            permissions.includes(UPDATE_PARENTS) && (
                                <SaveParentsDataToChild onEdit={onEditClicked}
                                                        isEditParentsModeEnabled={isEditParentsModeEnabled}/>)
                        }
                        {isEditParentsModeEnabled ? (
                                <>
                                    <ParentInEditMode child={currentChild}
                                                      childWithParents={childWithParents}
                                                      setChildWithParents={setChildWithParents}
                                                      setIsEditParentsModeEnabled={setIsEditParentsModeEnabled}/>
                                </>) :
                            <div className={`w-full`}>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-center">Name</TableHead>
                                            <TableHead className="text-center">IsEmergencyContact</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>{
                                        !!childWithParents.parents ? (
                                            childWithParents.parents.map((parent: ParentDataWithEmergencyContact, index: number) => (
                                                <TableRow key={index}
                                                          className={`hover:bg-blue-100 hover:cursor-pointer transition-all ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                                                          onClick={() => router.push(`/parents/${parent.parentDto.id}`, `/parents/${parent.parentDto.id}`)}>
                                                    <TableCell className="text-center">
                                                        {parent.parentDto.givenName + " " + parent.parentDto.familyName}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                <span className="material-icons-outlined">
                                                    <span className="material-icons-outlined">
                                                        {parent.isEmergencyContact ? 'check_box' : 'check_box_outline_blank'}
                                                    </span>
                                                </span>
                                                    </TableCell>

                                                </TableRow>
                                            ))) : (
                                            <TableRow>
                                                <TableCell className="text-center text-gray-400"
                                                           colSpan={2}>
                                                    Nothing added yet
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        }
                    </div>
                    <ShowTable className="mb-6" tableFields={["Name", "Diagnosed at"]}
                               value={currentChild.diagnosedDiseases}
                               showDeleteButton={false}/>
                    <ShowTable tableFields={["Name", "Dose", "Taken since"]}
                               value={currentChild.regularMedicines}
                               showDeleteButton={false}/>
                </div>
                <Toaster/>
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
                            entityType="Child"
                />
            </div>
        </AccessTokenContext.Provider>
    )
}