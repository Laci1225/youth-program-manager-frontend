import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import React from "react";
import {format, isValid, parseISO} from "date-fns";
import {Button} from "@/components/ui/button";

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
                            <TableHead key={value} className={"text-center"}>{value}</TableHead>
                        ))
                    }
                    {showDeleteButton && <TableHead className="w-5"></TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>{
                value && value?.length !== 0 ? (
                    value.map((field: object, index: number) => (
                        <TableRow key={index}>
                            {Object.values(field).map((value) => (
                                <TableCell key={value} className={"text-center"}>
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