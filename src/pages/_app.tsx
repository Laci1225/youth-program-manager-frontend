import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import 'material-icons/iconfont/material-icons.css';
import {UserProvider} from "@auth0/nextjs-auth0/client";
import Layout from "@/components/layout/Layout";
import {useState} from "react";
import PermissionContext from "@/context/permission-context";

export default function App({Component, pageProps}: AppProps) {
    const [permissions, setPermissions] = useState<string[]>([])
    return (
        <UserProvider>
            <PermissionContext.Provider value={{permissions, setPermissions}}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </PermissionContext.Provider>
        </UserProvider>
    )
}
