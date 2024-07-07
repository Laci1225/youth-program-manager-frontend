import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import React, {useContext, useEffect, useState} from "react";
import {Toaster} from "@/components/ui/toaster";
import {serverSideClient} from "@/api/graphql/client";
import {InferGetServerSidePropsType} from "next";
import {PlusSquare} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import DeleteData from "@/components/deleteData";
import SettingsDropdown from "@/components/SettingsDropdown";
import {getSession, withPageAuthRequired} from "@auth0/nextjs-auth0";
import AccessTokenContext from "@/context/access-token-context";
import jwt from "jsonwebtoken";
import PermissionContext from "@/context/permission-context";
import {CREATE_EMPLOYEES, DELETE_EMPLOYEES, LIST_EMPLOYEES, UPDATE_EMPLOYEES} from "@/constants/auth0-permissions";
import getAllEmployee from "@/api/graphql/employee/getAllEmployee";
import EmployeeForm from "@/form/employee/EmployeeForm";
import {EmployeeData} from "@/model/employee-data";
import deleteEmployee from "@/api/graphql/employee/deleteEmployee";

export const getServerSideProps = withPageAuthRequired<{
    employeesData: EmployeeData[],
    accessToken: string,
    permissions: string[]
}>({
    async getServerSideProps(context) {
        const session = await getSession(context.req, context.res);
        const employees = await getAllEmployee(session?.accessToken, serverSideClient)
        const claims = jwt.decode(session?.accessToken!) as jwt.JwtPayload;
        const permissions = claims["permissions"] as string[];
        if (permissions.includes(LIST_EMPLOYEES))
            return {
                props: {
                    employeesData: employees,
                    accessToken: session!.accessToken!,
                    permissions: permissions
                }
            };
        else {
            return {
                notFound: true
            }
        }

    }
})

export default function Employees({
                                      employeesData,
                                      accessToken,
                                      permissions
                                  }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const {setPermissions} = useContext(PermissionContext)
    useEffect(() => {
        setPermissions(permissions)
    }, [permissions, setPermissions]);
    const router = useRouter()
    const [employees, setEmployees] = useState<EmployeeData[]>(employeesData)
    const onEmployeeSaved = (savedEmployee: EmployeeData) => {
        if (editedEmployee) {
            const modifiedEmployees = employees.map((employee) =>
                employee.id === savedEmployee.id ? savedEmployee : employee
            );
            setEmployees(modifiedEmployees)
        } else {
            setEmployees(prevState => [...prevState, savedEmployee])
        }
        setEditedEmployee(null)
    }
    const onEmployeeDeleted = (employee: EmployeeData) => {
        const updatedEmployees = employees.filter(p => p.id !== employee.id);
        setEmployees(updatedEmployees);
    }
    const [editedEmployee, setEditedEmployee] = useState<EmployeeData | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [deletedEmployee, setDeletedEmployee] = useState<EmployeeData>()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    function handleEditClick(employee: EmployeeData | null) {
        setIsEditDialogOpen(true)
        setEditedEmployee(employee)
    }

    function handleDeleteClick(employee: EmployeeData) {
        setIsDeleteDialogOpen(true)
        setDeletedEmployee(employee)
    }

    return (
        <AccessTokenContext.Provider value={accessToken}>
            <div className="container w-4/6 py-28">
                <div className="flex justify-between px-6 pb-6">
                    <span className="text-2xl font-bold text-gray-800">Employee List</span>
                    {
                        permissions.includes(CREATE_EMPLOYEES) && (
                            <Button onClick={(event) => {
                                event.preventDefault()
                                handleEditClick(null)
                            }}>
                                <PlusSquare size={20} className="mr-1"/>
                                <span>Create</span>
                            </Button>
                        )
                    }
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center w-2/12">Email</TableHead>
                            <TableHead className="text-center">Name</TableHead>
                            <TableHead className="text-center w-2/12">Phone number</TableHead>
                            <TableHead className="text-center w-1/12">Type</TableHead>
                            <TableHead className="px-5"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            !!employees ? (
                                employees.map((employeeType, index) => (
                                    <TableRow key={employeeType.id}
                                              className={`hover:bg-blue-100 hover:cursor-pointer transition-all ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                                              onClick={() => router.push(`employees/${employeeType.id}`)}>
                                        <TableCell className="text-center">
                                            {employeeType.email}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {employeeType.familyName} {employeeType.givenName}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {employeeType.phoneNumber}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {employeeType.type}
                                        </TableCell>
                                        <TableCell className="p-1 text-center">
                                            <SettingsDropdown
                                                handleEditClick={() => handleEditClick(employeeType)}
                                                handleDeleteClick={() => handleDeleteClick(employeeType)}
                                                editPermission={UPDATE_EMPLOYEES}
                                                deletePermission={DELETE_EMPLOYEES}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))) : (
                                <TableRow>
                                    <TableCell colSpan={6}>Nothing added</TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table>
                <Toaster/>
                <EmployeeForm existingEmployee={editedEmployee ?? undefined}
                              isOpen={isEditDialogOpen}
                              onEmployeeModified={onEmployeeSaved}
                              onOpenChange={setIsEditDialogOpen}
                />
                <DeleteData entityId={deletedEmployee?.id}
                            entityLabel={`${deletedEmployee?.familyName} ${deletedEmployee?.givenName}`}
                            isOpen={isDeleteDialogOpen}
                            onOpenChange={setIsDeleteDialogOpen}
                            onSuccess={onEmployeeDeleted}
                            deleteFunction={deleteEmployee}
                            entityType="Empolyee"
                />
            </div>
        </AccessTokenContext.Provider>
    )
}