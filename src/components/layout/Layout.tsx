import React from "react";
import Navbar from "./Navbar";

interface LayoutProps {
    children: React.ReactNode
}

const Layout = ({children}: LayoutProps) => {
    return (
        <>
            <Navbar/>
            <div className="pt-16">
                {children}
            </div>
        </>
    );
};

export default Layout;
