import {UseFormReturn} from "react-hook-form";
import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Medicine} from "@/form/InputDiseaseHandler";

interface InputHandlerProps {
    showMedicinesForm: boolean,
    setShowMedicinesForm: React.Dispatch<boolean>,
    medicines: Medicine[]
    setMedicines: React.Dispatch<Medicine[]>
    form: UseFormReturn<{ diseases: { name: string; date?: string | undefined; }[]; address: string; familyName: string; givenName: string; birthPlace: string; birthDate?: any; medicines?: { name: string; dose: string; takenSince?: string | undefined; }[] | undefined; }, any, undefined>
}

export function InputMedicinesHandler({
                                          showMedicinesForm,
                                          setShowMedicinesForm,
                                          medicines,
                                          setMedicines,
                                          form
                                      }: InputHandlerProps) {
    const [showMedicines2Form, setShowMedicines2Form] = useState(false);
    const [medicinesName, setMedicinesName] = useState("");
    const [medicinesDose, setMedicinesDose] = useState("");
    const [medicinesTakenSince, setMedicinesTakenSince] = useState("");
    const handleAddMedicines = () => {
        const newMedicine = {name: medicinesName, dose: medicinesDose, takenSince: medicinesTakenSince};
        setMedicines([...medicines, newMedicine])
        setShowMedicines2Form(false);
    };
    return (
        <>
            <Input onClick={() => setShowMedicinesForm(true)} readOnly placeholder={"Medicines: " + medicines.length}/>

            {showMedicinesForm && (
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
                            {medicines?.map((medicine) => (
                                <TableRow key={0}>
                                    <TableCell className="w-1/2">{medicine.name}</TableCell>
                                    <TableCell className="w-1/2">{medicine.dose}</TableCell>
                                    <TableCell className="w-1/2">{medicine.takenSince}</TableCell>
                                </TableRow>
                            ))
                            }

                        </TableBody>
                    </Table>
                    <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setShowMedicinesForm(false)}>Cancel</Button>
                        <Button onClick={() => setShowMedicines2Form(true)} type={"button"}>Add</Button>
                    </div>
                </div>
            )}

            {showMedicines2Form &&
                <Card className="w-[350px] fixed  top-1/2 z-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <CardHeader>
                        <CardTitle>Add disease</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <FormField
                                    control={form.control}
                                    name={`medicines.${medicines.length}.name`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Name" onChange={
                                                    (event) => {
                                                        setMedicinesName(event.target.value)
                                                        form.setValue(`medicines.${medicines.length}.name`, event.target.value)
                                                    }}/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`medicines.${medicines.length}.dose`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Dose</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Dose"
                                                       onChange={
                                                           (event) => {
                                                               setMedicinesDose(event.target.value)
                                                               form.setValue(`medicines.${medicines.length}.dose`, event.target.value)
                                                           }}/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`medicines.${medicines.length}.takenSince`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Taken since</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Taken since" onChange={
                                                    (event) => {
                                                        setMedicinesTakenSince(event.target.value)
                                                        form.setValue(`medicines.${medicines.length}.takenSince`, event.target.value)
                                                    }}/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => setShowMedicines2Form(false)}>Cancel</Button>
                        <Button onClick={handleAddMedicines}>Add</Button>
                    </CardFooter>
                </Card>
            }
        </>)
}
