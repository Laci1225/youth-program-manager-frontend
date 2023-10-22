import {UseFormReturn} from "react-hook-form";
import React, {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";

export interface Disease {
    id: number;
    name: string;
    date: string;
}// TODO not in a good place
export interface Medicine {
    name: string;
    dose: string;
    takenSince: any;
}


interface InputHandlerProps {
    showDiseaseForm: boolean,
    setShowDiseaseForm: React.Dispatch<boolean>,
    diseases: Disease[]
    setDiseases: React.Dispatch<Disease[]>
    form: UseFormReturn<{ familyName: string; givenName: string; birthPlace: string; address: string; diseases: { id: number; name: string; date?: string | undefined; }[]; birthDate?: any; medicines?: { name: string; dose: string; takenSince?: any; }[] | undefined; }, any, undefined>
}

export function InputDiseaseHandler({
                                        showDiseaseForm,
                                        setShowDiseaseForm,
                                        diseases,
                                        setDiseases,
                                        form
                                    }: InputHandlerProps) {
    const [showDisease2Form, setShowDisease2Form] = useState(false);
    const [diseaseID, setDiseaseID] = useState(0);
    const [diseaseName, setDiseaseName] = useState("");
    const [diseaseDate, setDiseaseDate] = useState("");
    useEffect(() => {
        diseases
    }, [diseases]);
    const handleAddDisease = () => {
        const newDisease = {id: diseaseID, name: diseaseName, date: diseaseDate};
        setDiseases([...diseases, newDisease])
        setDiseaseID(diseaseID + 1)
        setShowDisease2Form(false);
    };
    return (
        <>
            <Input onClick={() => setShowDiseaseForm(true)} readOnly placeholder={"Added disease: " + diseases.length}/>

            {showDiseaseForm && (
                <div
                    className={"fixed bg-amber-100 rounded p-4 w-1/3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"}>
                    <Table>
                        <TableCaption>A list of added diseases.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/3">Name</TableHead>
                                <TableHead className="w-1/3">Date</TableHead>
                                <TableHead className="w-1/3">Edit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>

                            {
                                diseases && diseases.length!== 0 ? (
                                    diseases.map((disease) => (
                                        <TableRow key={disease.id}>
                                            <TableCell className="w-1/3">{disease.name}</TableCell>
                                            <TableCell className="w-1/3">{disease.date}</TableCell>
                                            <TableCell className="w-1/3">
                                                <Button type={"button"} variant={"destructive"}
                                                    onClick={() => {
                                                        const updatedDiseases = diseases.filter((d) => d.id !== disease.id);
                                                        setDiseases(updatedDiseases);
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
                    <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setShowDiseaseForm(false)}>Cancel</Button>
                        <Button onClick={() => setShowDisease2Form(true)} type={"button"}>Add</Button>
                    </div>
                </div>
            )}

            {showDisease2Form &&
                <Card className="w-[350px] fixed  top-1/2 z-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <CardHeader>
                        <CardTitle>Add disease</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <FormField
                                control={form.control}
                                name={`diseases.${diseases.length}.name`}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name"
                                                   onChange={
                                                       (event) => {
                                                           setDiseaseName(event.target.value)
                                                           form.setValue(`diseases.${diseases.length}.name`, event.target.value)
                                                       }}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`diseases.${diseases.length}.date`}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Date</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Date"
                                                   onChange={(event) => {
                                                       setDiseaseDate(event.target.value)
                                                       form.setValue(`diseases.${diseases.length}.date`, event.target.value)
                                                   }}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => setShowDisease2Form(false)}>Cancel</Button>
                        <Button onClick={handleAddDisease}>Add</Button>
                    </CardFooter>
                </Card>
            }
        </>)
}
