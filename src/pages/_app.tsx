import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import 'material-icons/iconfont/material-icons.css';
import {UserProvider} from "@auth0/nextjs-auth0/client";
import Layout from "@/components/layout/Layout";
import {useState} from "react";
import PermissionContext from "@/context/permission-context";
import CookieConsent, { Cookies } from "react-cookie-consent";

export default function App({Component, pageProps}: AppProps) {
    const [permissions, setPermissions] = useState<string[]>([])
    return (
        <UserProvider>
            <PermissionContext.Provider value={{permissions, setPermissions}}>
                <Layout>
                    <Component {...pageProps} />
                    <CookieConsent
                        location="bottom"
                        buttonText="Accept"
                        style={{ background: "#2B343B", width:"96%",margin: "2%", border: "1px solid #AAAAAA"}}
                        buttonStyle={{ color: "#000000", fontSize: "15px" }}
                        expires={1}
                        declineButtonText="Decline"
                        enableDeclineButton={true}
                        overlay={true}
                        overlayStyle={{ background: "rgba(0,0,0,0.8)" }}
                    >
                        This website uses cookies to enhance the user experience.{" "}
                    </CookieConsent>
                </Layout>
            </PermissionContext.Provider>
        </UserProvider>
    )
}
