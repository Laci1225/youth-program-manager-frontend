import {useUser} from "@auth0/nextjs-auth0/client";
import {getSession} from "@auth0/nextjs-auth0";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import jwt from "jsonwebtoken";
import React, {useContext, useEffect} from "react";
import PermissionContext from "@/context/permission-context";
import {Axios} from "axios";
import getCurrentUser from "@/api/rest/getCurrentUser";
import getParentById from "@/api/graphql/parent/getParentById";
import {ParentDataWithChildren} from "@/model/parent-data";
import {EmployeeData} from "@/model/employee-data";
import getEmployeeById from "@/api/graphql/employee/getEmployeeById";
import {serverSideClient} from "@/api/graphql/client";
import ParentDetails from "@/components/parent-details";
import EmployeeDetails from "@/components/employee-details";

export const getServerSideProps = (async (context) => {
    const session = await getSession(context.req, context.res);
    if (session) {
        const claims = jwt.decode(session?.accessToken!) as jwt.JwtPayload;
        const userData = await getCurrentUser(session?.accessToken!);
        let userDetails: ParentDataWithChildren | EmployeeData | null = null
        if (userData.userType === "PARENT") {
            userDetails = await getParentById(userData.userId, session?.accessToken!, serverSideClient)
        } else {
            userDetails = await getEmployeeById(userData.userId, session?.accessToken!, serverSideClient)
        }
        const permissions = claims["permissions"] as string[];
        return {
            props: {
                userDetails: userDetails,
                userType: userData.userType,
                permissions: permissions
            }
        };
    } else {
        return {
            props: {
                permissions: null
            }
        }
    }
}) satisfies GetServerSideProps<{ permissions: string[] | null }>;


export default function Home({
                                 userDetails,
                                 userType,
                                 permissions
                             }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const {setPermissions} = useContext(PermissionContext)
    useEffect(() => {
        if (permissions)
            setPermissions(permissions)
    }, [permissions, setPermissions]);
    console.log(userType)
    console.log(userDetails)
    if (!userDetails) {
        return (<div>
            <h1>Not found</h1>
        </div>)
    }
    if (userType === "PARENT") {
        return (<div>
            <ParentDetails parentData={userDetails as ParentDataWithChildren} permissions={permissions}/>
        </div>)
    } else {
        return (<div>
            <EmployeeDetails employeeData={userDetails as EmployeeData}/>
        </div>)
    }
}
