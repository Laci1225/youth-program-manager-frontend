import {useForm} from "react-hook-form";
import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {toast} from "@/components/ui/use-toast"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import * as z from "zod";
import {getMedicineSchema, medicineSchema} from "@/form/child/childSchema";
import {zodResolver} from "@hookform/resolvers/zod";
import CalendarInput from "@/form/CalendarInput";
import {handleSubmitStopPropagation} from "@/form/stopPropagation";
import {Medicine} from "@/model/medicine";

interface InputHandlerProps {
    value?: Medicine[];
    onChange: (newValue: Medicine[]) => void
}

export function InputMedicinesHandler({value, onChange}: InputHandlerProps) {

    const medicineForm = useForm<z.infer<typeof medicineSchema>>({
        resolver: zodResolver(getMedicineSchema(value ?? [])),
        defaultValues: {
            name: "",
            dose: "",
            takenSince: undefined
        }
    })
    const [isDialogOpen, setDialogOpen] = useState(false);

    function onMedicineSubmit(values: z.infer<typeof medicineSchema>) {
        onChange([...value ?? [], values]);
        toast({
            title: "Medicine successfully added",
            duration: 2000
        })
        setDialogOpen(false);
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button type="button"
                        variant="default"
                        onClick={() => {
                            setDialogOpen(true)
                            medicineForm.reset()
                        }}>
                    Add a regular medicine
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Create a medicine</DialogTitle>
                </DialogHeader>
                <Form {...medicineForm}>
                    <form onSubmit={handleSubmitStopPropagation(medicineForm)(onMedicineSubmit)}>
                        <div className="grid w-full items-center">
                            <FormField
                                control={medicineForm.control}
                                name={`name`}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name*</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name" {...field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={medicineForm.control}
                                name={`dose`}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Dose*</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Dose" {...field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={medicineForm.control}
                                name={`takenSince`}
                                render={({field}) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Taken since</FormLabel>
                                            <FormControl>
                                                <CalendarInput {...field} shownYear={2016}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )
                                }}
                            />
                            <Button type="submit">Add</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
