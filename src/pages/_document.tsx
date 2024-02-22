import {Html, Head, Main, NextScript} from 'next/document'
import Navbar from "@/components/layout/Navbar";
import Layout from "@/components/layout/Layout";

export default function Document() {
    return (
        <Html lang="en">
            <Head/>
            <Navbar/>
            <body>
                <Main/>
                <NextScript/>
            </body>
        </Html>
    )
}
