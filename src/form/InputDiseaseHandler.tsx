import {UseFormReturn} from "react-hook-form";
import React, {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {Calendar as CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";

export interface Disease {
    //id: number;
    name: string;
    diagnosedAt: any;//TODO any
}// TODO not in a good place
export interface Medicine {
    id: number;
    name: string;
    dose: string;
    takenSince: any;
}


interface InputHandlerProps {
    showDiseaseForm: boolean,
    setShowDiseaseForm: React.Dispatch<boolean>,
    diseases: Disease[]
    setDiseases: React.Dispatch<Disease[]>
    form:UseFormReturn<{     familyName: string;     givenName: string;     birthDate: string;     birthPlace: string;     address: string;     diseases: {         name: string;         diagnosedAt: string;     }[];     medicines?: {         name: string;         id: number;         dose: string;         takenSince?: any;     }[] | undefined; }, any, undefined>
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
    const [diseaseDiagnosedAt, setDiseaseDiagnosedAt] = useState<Date>();
    const handleAddDisease = () => {
        const newDisease = {id: diseaseID, name: diseaseName, diagnosedAt: diseaseDiagnosedAt};
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
                                        <TableRow key={0}>
                                            <TableCell className="w-1/3">{disease.name}</TableCell>
                                            <TableCell className="w-1/3">{format(disease.diagnosedAt,"yyyy-MM-dd")}</TableCell>
                                            <TableCell className="w-1/3">
                                                <Button type={"button"} variant={"destructive"}
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
                                name={`diseases.${0}.name`}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name"
                                                   onChange={
                                                       (event) => {
                                                           setDiseaseName(event.target.value)
                                                           form.setValue(`diseases.${0}.name`, event.target.value,{shouldValidate:true})
                                                       }}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`diseases.${0}.diagnosedAt`}
                                render={({field}) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Diagnosed at</FormLabel>
                                            <FormControl>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[280px] justify-start text-left font-normal",
                                                                !diseaseDiagnosedAt && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4"/>
                                                            {diseaseDiagnosedAt ? format(diseaseDiagnosedAt, "PPP") : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode={"single"}
                                                            initialFocus
                                                            selected={diseaseDiagnosedAt}
                                                            onSelect={(newDate) => {
                                                                form.setValue(`diseases.${diseases.length}.diagnosedAt`, newDate ? format(newDate, "yyyy-MM-dd") : "",{shouldValidate:true});
                                                                setDiseaseDiagnosedAt(newDate);
                                                            }}
                                                            defaultMonth={new Date(2018, 1)}
                                                            toMonth={new Date()}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                        </FormItem>
                                    )
                                }}
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
