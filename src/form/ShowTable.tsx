import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import React from "react";
import {format, isValid, parseISO} from "date-fns";
import {Button} from "@/components/ui/button";
import {Disease} from "@/model/disease";
import {Medicine} from "@/model/medicine";

interface ShowTableProps {
    tableFields: string[],
    value: any[] | undefined;
    showDeleteButton: boolean
}

function isStrictDate(value: string) {
    const parsedDate = parseISO(value);
    return isValid(parsedDate);
}

export default function ShowTable({tableFields, value, showDeleteButton}: ShowTableProps) {
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
                                    {isStrictDate(value) ? (
                                        <>{format(new Date(value), "P")}</>
                                    ) : (
                                        <>{value}</>
                                    )}
                                </TableCell>
                            ))}
                            {showDeleteButton &&
                                <TableCell className="w-6">
                                    <Button type={"button"} className="p-0"
                                            variant={"ghost"}
                                            onClick={() => {
                                                //const updatedDiseases = diseases.filter((d) => d.id !== disease.id);
                                                //setDiseases(updatedDiseases);
                                            }}><span className="material-icons-outlined">delete</span></Button>
                                </TableCell>
                            }
                        </TableRow>
                    ))) : (
                    <TableRow>
                        <TableCell className={"text-center text-gray-400"} colSpan={tableFields.length}>
                            Nothing added yet
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </div>)
}