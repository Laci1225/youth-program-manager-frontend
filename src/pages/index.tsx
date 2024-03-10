import {useUser} from "@auth0/nextjs-auth0/client";
import {getSession} from "@auth0/nextjs-auth0";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import jwt from "jsonwebtoken";
import React, {useContext, useEffect} from "react";
import PermissionContext from "@/context/permission-context";

export const getServerSideProps = (async (context) => {
    const session = await getSession(context.req, context.res);
    if (session) {
        const claims = jwt.decode(session?.accessToken!) as jwt.JwtPayload;
        const permissions = claims["permissions"] as string[];
        return {
            props: {
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


export default function Home({permissions}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const {setPermissions} = useContext(PermissionContext)
    useEffect(() => {
        if (permissions)
            setPermissions(permissions)
    }, [permissions, setPermissions]);
    const {user, error, isLoading} = useUser();

    if (user)
        return <div>
            <img src={`${user.picture}`} alt=""/>
            Welcome {user.name}
        </div>
}
