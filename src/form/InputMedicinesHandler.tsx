import {useForm} from "react-hook-form";
import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {useToast} from "@/components/ui/use-toast"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import * as z from "zod";
import {medicineSchema} from "@/form/formSchema";
import {zodResolver} from "@hookform/resolvers/zod";
import CalendarInput from "@/form/CalendarInput";
import {handleSubmitStopPropagation} from "@/form/stopPropagation";

interface InputHandlerProps {
    value: any;
    onChange: (newValue: any) => void
}

export function InputMedicinesHandler({value, onChange}: InputHandlerProps) {

    const medicineForm = useForm<z.infer<typeof medicineSchema>>({
        resolver: zodResolver(medicineSchema),
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
        })
        setDialogOpen(false)
    }

    const {toast} = useToast()
    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild className="block w-full text-left">
                <Button className={"justify-start w-full border border-gray-700"}
                        type={"button"}
                        variant={"outline"}
                        onClick={() => {
                            setDialogOpen(true)
                            medicineForm.reset()
                        }}>
                    Add a regular medicine
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] h-[500px] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                </DialogHeader>
                <Form {...medicineForm}>
                    <form onSubmit={handleSubmitStopPropagation(medicineForm)(onMedicineSubmit)}>
                        <div className="grid w-full items-center gap-4">
                            <FormField
                                control={medicineForm.control}
                                name={`name`}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name*</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name" {...field}/>
                                        </FormControl>
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
                                                <CalendarInput {...field}/>
                                            </FormControl>
                                        </FormItem>
                                    )
                                }}
                            />
                            <Button type={"submit"}>Add</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
