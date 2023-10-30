import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import React from "react";
import {format} from "date-fns";
import {Button} from "@/components/ui/button";
import {UseFormReturn} from "react-hook-form";
import {Disease} from "@/form/InputDiseaseHandler";

interface ShowTableProps {
    tableFields: string[],
    formField: string,
    form: UseFormReturn
}

export default function ShowTable({tableFields,formField,form}: ShowTableProps) {

    return (<div className={"w-full"}>
        <Table className={"w-full border border-gray-700"}>
            <TableCaption>A list of added diseases.</TableCaption>
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
                form.getValues(formField)?.length !== 0 ? (
                    form.getValues(formField).map((disease: Disease) => (
                <TableRow key={disease.name}>
                    <TableCell
                        className="w-1/3">{disease.name}</TableCell>
                    <TableCell
                        className="w-1/3">{format(disease.diagnosedAt, "P")}</TableCell>
                    <TableCell className="w-1/3">
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