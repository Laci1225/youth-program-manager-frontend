import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {ChildData} from "@/model/child-data";
import {client} from "@/api/client";
import {gql} from "@apollo/client";
import {redirect} from "next/navigation";
import {router} from "next/client";

/*
export const getServerSideProps = (async () => {

        return {
            props: {
                children
            }
        };
}) satisfies GetServerSideProps<{ children: ChildData[] }>;

export default function Seasons({children}: InferGetServerSidePropsType<typeof getServerSideProps>) {
*/
export default function Children() {
    const [children, setChildren] = useState<ChildData[]>([])

    useEffect(() => {
        client
            .query({
                query: gql(`
                query GetChild {
                    children {
                        id
                        familyName
                        givenName
                    }
                }
            `),
            })
            .then((result) => setChildren(result.data.children));
    }, []);

    return (
        <div className={"container w-4/6"}>
            <Table>
                <TableCaption>A list of added Children.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/3">Family Name</TableHead>
                        <TableHead className="w-1/3">Given Name</TableHead>
                        <TableHead className="w-1/3 text-right">Edit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        children && children.length !== 0 ? (
                            children.map((child) => (
                                <TableRow key={child.id}>
                                    <TableCell className="w-1/3">{child.familyName}</TableCell>
                                    <TableCell className="w-1/3">{child.givenName}</TableCell>
                                    <TableCell className="w-1/3 text-right">
                                        <Button type={"button"} variant={"destructive"}
                                                onClick={() => {
                                                    const updatedChildren = children.filter((c) => c.id !== child.id);
                                                    setChildren(updatedChildren);
                                                }}>Remove</Button>
                                    </TableCell>
                                </TableRow>
                            ))) : (
                            <TableRow>
                                <TableCell className="w-1/3">Nothing</TableCell>
                                <TableCell className="w-1/3">added</TableCell>

                            </TableRow>
                        )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>
                            <Button type={"button"} className="w-full h-2"
                            onClick={()=>{}
                                //()=>router.push("/childform")
                            }>
                                Add child
                            </Button>
                        </TableCell>
                    </TableRow>

                </TableFooter>
            </Table>
        </div>
    )
}