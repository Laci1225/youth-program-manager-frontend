import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import React from "react";
import {format} from "date-fns";
import {Button} from "@/components/ui/button";
import {Disease} from "@/model/disease";
import {Medicine} from "@/model/medicine";
import {isStrictDate} from "@/utils/date";
import {toast} from "@/components/ui/use-toast";
import {cn} from "@/lib/utils";

interface ShowTableProps {
    tableFields: string[],
    value: any[] | undefined;
    showDeleteButton: boolean
    onChange?: (...event: any[]) => void;
    className?: string
}

export default function ShowTable({tableFields, value, showDeleteButton, onChange, className}: ShowTableProps) {
    const handleDelete = (index: number) => {
        if (value && onChange) {
            onChange(value.filter((_, i) => i !== index));
            toast({
                title: "Successfully deleted",
                duration: 2000
            });
        }
    };
    return (<div className={cn(`w-full`, className)}>
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
                    value.map((field: Disease | Medicine, index: number) => (
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
                                            onClick={() => handleDelete(index)}>
                                        <span className="material-icons-outlined">delete</span>
                                    </Button>
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