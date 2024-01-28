import {Html, Head, Main, NextScript} from 'next/document'
import Navbar from "@/components/layout/Navbar";

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
