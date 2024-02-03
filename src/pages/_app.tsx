import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import 'material-icons/iconfont/material-icons.css';
import {UserProvider} from "@auth0/nextjs-auth0/client";
import Layout from "@/components/layout/Layout";


export default function App({Component, pageProps}: AppProps) {
    return (
        <UserProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </UserProvider>
    )
}
