import {UseFormReturn} from "react-hook-form";
import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Medicine} from "@/form/InputDiseaseHandler";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {ToastAction} from "@/components/ui/toast"
import {useToast} from "@/components/ui/use-toast"
import {cn} from "@/lib/utils";
import {Calendar as CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";

interface InputHandlerProps {
    regularMedicines: Medicine[]
    setMedicines: React.Dispatch<Medicine[]>
    form:
        UseFormReturn<{ regularMedicines?: { name: string; dose: string; takenSince?: any; }[] | undefined; }, any, undefined>
    onMedicinePressed: (medicines: Medicine[]) => void;
}

export function InputMedicinesHandler({
                                          regularMedicines,
                                          setMedicines,
                                          form,
                                          onMedicinePressed
                                      }: InputHandlerProps) {
    const [medicineName, setMedicineName] = useState("");
    const [medicineDose, setMedicineDose] = useState("");
    const [medicineTakenSince, setMedicineTakenSince] = useState<Date>();
    const [medicineID, setMedicineID] = useState(0);
    const handleAddMedicines = () => {
        const newMedicine = {id: medicineID, name: medicineName, dose: medicineDose, takenSince: medicineTakenSince};
        setMedicines([...regularMedicines, newMedicine])
        onMedicinePressed([...regularMedicines, newMedicine])
        setMedicineID(medicineID + 1)
    };
    const {toast} = useToast()
    return (
        <div className="grid w-full items-center gap-4">
            <FormField
                control={form.control}
                name={`regularMedicines.${medicineID}.name`}
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Name" onChange={
                                (event) => {
                                    setMedicineName(event.target.value)
                                    form.setValue(`regularMedicines.${medicineID}.name`, event.target.value, {shouldValidate: true})
                                }}/>
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`regularMedicines.${medicineID}.dose`}
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Dose</FormLabel>
                        <FormControl>
                            <Input placeholder="Dose"
                                   onChange={
                                       (event) => {
                                           setMedicineDose(event.target.value)
                                           form.setValue(`regularMedicines.${medicineID}.dose`, event.target.value, {shouldValidate: true})
                                       }}/>
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`regularMedicines.${medicineID}.takenSince`}
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
                                            {medicineTakenSince ? format(medicineTakenSince, "P") :
                                                <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode={"single"}
                                            initialFocus
                                            selected={medicineTakenSince}
                                            onSelect={(newDate) => {
                                                form.setValue(`regularMedicines.${medicineID}.takenSince`, newDate ? newDate : undefined, {shouldValidate: true});
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

            <Button onClick={() => {
                handleAddMedicines()
                toast({
                    title: "Medicine successfully added",
                    description: medicineName + " " + medicineDose + " " + medicineTakenSince,
                    action: (
                        //todo
                        <ToastAction altText="Goto schedule to undo"></ToastAction>
                    ),
                })
            }
            }

                    type={"button"}>Add</Button>
        </div>
    )
}
