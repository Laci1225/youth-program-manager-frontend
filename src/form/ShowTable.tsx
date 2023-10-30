import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import React from "react";
import {format} from "date-fns";
import {Button} from "@/components/ui/button";
import {UseFormReturn} from "react-hook-form";
import {Disease} from "@/model/disease";
import {Medicine} from "@/model/medicine";

interface ShowTableProps {
    tableFields: string[],
    formField: string,
    form: UseFormReturn
}

export default function ShowTable({tableFields, formField, form}: ShowTableProps) {

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
                form.getValues(formField) && form.getValues(formField)?.length !== 0 ? (
                    form.getValues(formField).map((field: Array<Disease | Medicine>, index: number) => (
                        <TableRow key={index}>
                            {Object.keys(field).map((key) => (
                                <TableCell key={key}>
                                    {field[key] instanceof Date ? (
                                        <>{format(field[key], "P")}</>
                                    ) : (
                                        <>{field[key]}</>
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