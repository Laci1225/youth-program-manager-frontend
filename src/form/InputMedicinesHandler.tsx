import {UseFormReturn} from "react-hook-form";
import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Medicine} from "@/form/InputDiseaseHandler";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import {cn} from "@/lib/utils";
import {Calendar as CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {Toaster} from "@/components/ui/toaster";
interface InputHandlerProps {
    medicines: Medicine[]
    setMedicines: React.Dispatch<Medicine[]>
    form:
        UseFormReturn<{     medicines?: {         name: string;         dose: string;         takenSince?: any;     }[] | undefined; }, any, undefined>
}

export function InputMedicinesHandler({
                                          medicines,
                                          setMedicines,
                                          form
                                      }: InputHandlerProps) {
    const [medicineName, setMedicineName] = useState("");
    const [medicineDose, setMedicineDose] = useState("");
    const [medicineTakenSince, setMedicineTakenSince] = useState<Date>();
    //const [medicineID, setMedicineID] = useState(0);
    const handleAddMedicines = () => {
        const newMedicine = {name: medicineName, dose: medicineDose, takenSince: medicineTakenSince};
        setMedicines([...medicines, newMedicine])
        //setMedicineID(medicineID + 1)
    };
    const {toast} = useToast()
    return (
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
                                    setMedicineName(event.target.value)
                                    form.setValue(`medicines.${medicines.length}.name`, event.target.value,{shouldValidate: true})
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
                                           setMedicineDose(event.target.value)
                                           form.setValue(`medicines.${medicines.length}.dose`, event.target.value,{shouldValidate: true})
                                       }}/>
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`medicines.${medicines.length}.takenSince`}
                render={({field}) => {
                    return (
                        <FormItem>
                            <FormLabel>Taken since</FormLabel>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[280px] justify-start text-left font-normal",
                                                !medicineTakenSince && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4"/>
                                            {medicineTakenSince ? format(medicineTakenSince, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode={"single"}
                                            initialFocus
                                            selected={medicineTakenSince}
                                            onSelect={(newDate) => {
                                                form.setValue(`medicines.${medicines.length}.takenSince`, newDate ? format(newDate, "yyyy-MM-dd") : undefined,{shouldValidate: true});
                                                setMedicineTakenSince(newDate);
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

            <Button onClick={()=> {
                handleAddMedicines()
                toast({
                    title: "Medicine successfully added",
                    description: medicineName +" "+ medicineDose +" "+ medicineTakenSince,
                    action: (
                        //todo
                        <ToastAction altText="Goto schedule to undo" ></ToastAction>
                    ),
                })
            }
            }

                    type={"submit"}>Add</Button>
        </div>
    )
}
