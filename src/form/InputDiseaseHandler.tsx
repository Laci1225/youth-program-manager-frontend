import {ApolloClient, InMemoryCache} from "@apollo/client";
import {ControllerRenderProps, UseFormReturn} from "react-hook-form";
import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";

export interface Disease {
    name: string,
    date: string
}// TODO not in a good place
export interface Medicines {
    name: string,
    dose: string
    takenSince: string
}



interface InputHandlerProps {
    showDiseaseForm: boolean,
    setShowDiseaseForm: React.Dispatch<boolean>,
    diseases: Disease
    setDiseases: React.Dispatch<Disease>
    form: UseFormReturn<{
        familyName: string; givenName: string; birthDate?: any, birthPlace: string; address: string; diseases: {
            name: string;
            date?: string | undefined;
        };
        medicines?: {
            name: string;
            dose: string;
            takenSince?: string | undefined;
        };
    }, any, undefined>
}

export function InputDiseaseHandler({
                                        showDiseaseForm,
                                        setShowDiseaseForm,
                                        diseases,
                                        setDiseases,
                                        form
                                    }: InputHandlerProps) {
    const [showDisease2Form, setShowDisease2Form] = useState(false);
    const [diseaseName, setDiseaseName] = useState("");
    const [diseaseDate, setDiseaseDate] = useState("");
    const handleAddDisease = () => {
        const newDisease = {name: diseaseName, date: diseaseDate};
        setDiseases(newDisease)//[...diseases, newDisease]);
        setShowDisease2Form(false);
    };
    return (
        <>
            <Input onClick={() => setShowDiseaseForm(true)} readOnly placeholder={diseases.name + " " + diseases.date}/>

            {showDiseaseForm && (
                <div
                    className={"fixed bg-amber-100 rounded p-4 w-1/3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"}>
                    <Table>
                        <TableCaption>A list of added diseases.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/2">Name</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {//diseases?.map((disease) => (
                                <TableRow key={0}>
                                    <TableCell className="w-1/2">{diseases.name}</TableCell>
                                    <TableCell className="w-1/2">{diseases.date}</TableCell>
                                </TableRow>
                                //))
                            }

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
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <FormField
                                    control={form.control}
                                    name="diseases.name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Name" {...field}/>
                                                {//onChange={(event) => setDiseaseName(event.target.value)}/>
                                                }
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="diseases.date"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Date</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Date" {...field}/>
                                                {//onChange={(event) => setDiseaseDate(event.target.value)}/>
                                                }
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {/*<div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" placeholder="Name" {...field}
                                           onChange={(event) => setDiseaseName(event.target.value)}/>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="date">Name</Label>
                                    <Input id="date" placeholder="Date" {...field}
                                           onChange={(event) => setDiseaseDate(event.target.value)}/>
                                </div>*/}
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => setShowDisease2Form(false)}>Cancel</Button>
                        <Button onClick={handleAddDisease}>Add</Button>
                    </CardFooter>
                </Card>
            }
        </>)
}
