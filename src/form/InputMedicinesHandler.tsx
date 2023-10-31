import {useForm, UseFormReturn} from "react-hook-form";
import React from "react";
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
    form:
        UseFormReturn<{
            familyName: string;
            givenName: string;
            birthDate: Date;
            birthPlace: string;
            address: string;
            diseases: {
                name: string;
                diagnosedAt: Date;
            }[];
            medicines?: {
                name: string;
                dose: string;
                takenSince?: any;
            }[] | undefined;
        }>
}

export function InputMedicinesHandler({form,}: InputHandlerProps) {

    const medicineForm = useForm<z.infer<typeof medicineSchema>>({
        resolver: zodResolver(medicineSchema),
        defaultValues: {
            name: "",
            dose: "",
            takenSince: undefined
        }
    })

    function onMedicineSubmit(values: z.infer<typeof medicineSchema>) {
        form.setValue("medicines", [...(form.getValues("medicines") ?? []), values], {shouldValidate: true})
        console.log(form.getValues("medicines"))
        toast({
            title: "Medicine successfully added",
            //description: medicineName +" "+ medicineDose +" "+ medicineTakenSince,
        })
    }

    const {toast} = useToast()
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className={"w-full"}>
                    <Button className={"w-full h-full"} type={"button"} inputMode={"none"}
                            variant={"ghost"}>
                        Add a regular medicine
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] h-full overflow-auto">
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
                                        <FormLabel>Name</FormLabel>
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
                                        <FormLabel>Dose</FormLabel>
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
