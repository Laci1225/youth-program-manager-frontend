import {InferGetServerSidePropsType} from "next";
import React, {useContext, useEffect, useState} from "react";
import Link from "next/link";
import {Toaster} from "@/components/ui/toaster";
import {Label} from "@/components/ui/label";
import {fieldAppearance} from "@/components/fieldAppearance";
import {Pencil, Trash} from "lucide-react";
import {useRouter} from "next/router";
import {serverSideClient} from "@/api/graphql/client";
import DeleteData from "@/components/deleteData";
import {getSession, withPageAuthRequired} from "@auth0/nextjs-auth0";
import AccessTokenContext from "@/context/access-token-context";
import jwt from "jsonwebtoken";
import PermissionContext from "@/context/permission-context";
import {
    DELETE_EMPLOYEES,
    READ_EMPLOYEES,
    UPDATE_EMPLOYEES,
} from "@/constants/auth0-permissions";
import getEmployeeById from "@/api/graphql/employee/getEmployeeById";
import EmployeeForm from "@/form/employee/EmployeeForm";
import deleteEmployee from "@/api/graphql/employee/deleteEmployee";
import {EmployeeData} from "@/model/employee-data";


export const getServerSideProps = withPageAuthRequired<{
    selectedEmployee: EmployeeData,
    accessToken: string,
    permissions: string[]
}, {
    employeeId: string
}>({
    async getServerSideProps(context) {
        let employeeData;
        if (context.params?.employeeId) {
            try {
                const session = await getSession(context.req, context.res);
                employeeData = await getEmployeeById(context.params.employeeId, session?.accessToken, serverSideClient);
                const claims = jwt.decode(session?.accessToken!) as jwt.JwtPayload;
                const permissions = claims["permissions"] as string[];
                if (permissions.includes(READ_EMPLOYEES))
                    return {
                        props: {
                            selectedEmployee: employeeData,
                            accessToken: session!.accessToken!,
                            permissions: permissions
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
export default function Ticket({
                                   selectedEmployee,
                                   accessToken,
                                   permissions
                               }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const {setPermissions} = useContext(PermissionContext)
    useEffect(() => {
        setPermissions(permissions)
    }, [permissions, setPermissions]);
    const [employee, setEmployee] = useState<EmployeeData>(selectedEmployee)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const router = useRouter()
    const onTicketUpdated = (newEmployee: EmployeeData) => {
        setEmployee(newEmployee)
    }
    const onTicketDeleted = () => {
        router.push("/employees")
    }

    function handleEditClick() {
        setIsEditDialogOpen(true)
    }

    function handleDeleteClick() {
        setIsDeleteDialogOpen(true)
    }

    return (
        <AccessTokenContext.Provider value={accessToken}>
            <div className="container w-3/6 py-10 h-[100vh] overflow-auto">
                <div className="flex justify-between px-6 pb-6 items-center">
                    <Link href="/employees">
                        <span className="material-icons-outlined">arrow_back</span>
                    </Link>
                    <div>
                        Ticket details
                    </div>
                    <div className="flex">
                        {
                            permissions.includes(UPDATE_EMPLOYEES) && (

                                <div className=" flex flex-row items-center hover:cursor-pointer px-5"
                                     onClick={(event) => {
                                         event.preventDefault()
                                         handleEditClick()
                                     }}>
                                    <Pencil className="mx-1"/>
                                    <span>Edit</span>
                                </div>)
                        }
                        {
                            permissions.includes(DELETE_EMPLOYEES) && (
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
                            {employee.email}
                        </div>
                    </div>
                    <div className="mb-6">
                        <Label>Description:</Label>
                        <div className={`${fieldAppearance} mt-2 h-fit`}>
                            {employee.familyName} {employee.givenName}
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center ">
                        <div className="mb-6 flex-1">
                            <Label>Price:</Label>
                            <div className={`${fieldAppearance} mt-2`}>
                                {employee.phoneNumber}
                            </div>
                        </div>
                        <div className="mb-6 flex-1">
                            <Label>Number of participation:</Label>
                            <div className={`${fieldAppearance} mt-2`}>
                                {employee.type}
                            </div>
                        </div>
                    </div>
                </div>
                <Toaster/>
                <EmployeeForm existingEmployee={employee ?? undefined}
                              isOpen={isEditDialogOpen}
                              onEmployeeModified={onTicketUpdated}
                              onOpenChange={setIsEditDialogOpen}
                />
                <DeleteData entityId={employee.id}
                            entityLabel={`${employee.familyName} ${employee.givenName}`}
                            isOpen={isDeleteDialogOpen}
                            onOpenChange={setIsDeleteDialogOpen}
                            onSuccess={onTicketDeleted}
                            deleteFunction={deleteEmployee}
                            entityType="Ticket"
                />
            </div>
        </AccessTokenContext.Provider>
    )
}