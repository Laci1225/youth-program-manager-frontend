import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import React from "react";
import {format} from "date-fns";
import {Button} from "@/components/ui/button";
import {Disease} from "@/model/disease";
import {Medicine} from "@/model/medicine";

interface ShowTableProps {
    tableFields: string[],
    value: any;
}

export default function ShowTable({tableFields, value}: ShowTableProps) {
    return (<div className={"w-full"}>
        <Table className={"w-full border border-gray-200"}>
            <TableHeader>
                <TableRow>
                    {
                        tableFields.map(value => (
                            <TableHead key={value}>{value}</TableHead>
                        ))
                    }
                    <TableHead className="w-5"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>{
                value && value?.length !== 0 ? (
                    value.map((field: Disease | Medicine, index: number) => (
                        <TableRow key={index}>
                            {Object.values(field).map((value) => (
                                <TableCell key={value}>
                                    {value instanceof Date ? (
                                        <>{format(value, "P")}</>
                                    ) : (
                                        <>{value}</>
                                    )}
                                </TableCell>
                            ))}
                            <TableCell className="w-6">
                                <Button type={"button"}
                                        variant={"destructive"}
                                        onClick={() => {
                                            //const updatedDiseases = diseases.filter((d) => d.id !== disease.id);
                                            //setDiseases(updatedDiseases);
                                        }}>Remove</Button>
                            </TableCell>
                        </TableRow>
                    ))) : (
                    <TableRow>
                        <TableCell className="w-1/3">Nothing</TableCell>
                        <TableCell className="w-1/3">added</TableCell>
                        <TableCell className="w-1/3">yet</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </div>)
}