import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {useForm} from "react-hook-form"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {format} from "date-fns"
import {cn} from "@/lib/utils"
import {Calendar} from "@/components/ui/calendar"
import {Calendar as CalendarIcon} from "lucide-react"
import {diseaseSchema, formSchema, medicineSchema} from "@/form/formSchema";
import {gql} from "@apollo/client";
import {Disease, InputDiseaseHandler, Medicine} from "@/form/InputDiseaseHandler";
import {InputMedicinesHandler} from "@/form/InputMedicinesHandler";
import {client} from "@/api/client";
import {PopoverClose} from "@radix-ui/react-popover";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {toast} from "@/components/ui/use-toast";
import addChild from "@/api/graphql/addChild";
import CalendarInput from "@/form/CalendarInput";
import ShowTable from "@/form/ShowTable";

function ChildForm() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            familyName: "",
            givenName: "",
            birthDate: undefined,
            birthPlace: "",
            address: "",
            diseases: [],
            //medicines: [{name: "", dose: "", takenSince: undefined}]
        },
    })
    const medicineForm = useForm<z.infer<typeof medicineSchema>>({
        resolver: zodResolver(medicineSchema),
        defaultValues: {
            name: "",
            dose: "",
            takenSince: undefined
        }
    })

    function onMedicinePressed(medicines:Medicine[]) {
        form.setValue("medicines", medicines,{shouldValidate: true})
    }

    function onSubmit(values: z.infer<typeof formSchema>) {

        console.log(values)
        addChild(values)
            .then((result) => {
                const addedChild = result.data.addChild;
                console.log(addedChild);
            });
        //router.push("children")
    }




    return (
        <div className={"container w-4/6 "}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, () => console.log("Valami nem jó"))}
                      className="flex justify-center flex-col space-y-8">
                    <FormField
                        control={form.control}
                        name="familyName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Family name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Family name" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="givenName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Given name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Given name" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="birthDate"
                        render={({field}) => {
                            return (
                                <FormItem>
                                    <FormLabel>Birthdate</FormLabel>
                                    <FormControl>
                                    <CalendarInput field={field} form={form} name={"birthDate"}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="birthPlace"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Birth place</FormLabel>
                                <FormControl>
                                    <Input placeholder="Birth place" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Address" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="diseases"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className={"block"}>Diseases </FormLabel>
                                <FormControl>
                                   <InputDiseaseHandler form={form}/>

                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Table className={"w-full border border-gray-700"}>
                        <TableCaption>A list of added diseases.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                {
                                    ["name","diagnosedAt"].map(value => (
                                        <TableHead key={value}>{value}</TableHead>
                                    ))
                                }
                                <TableHead className="w-5"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>{
                            form.getValues("diseases")?.length !== 0 ? (
                                form.getValues("diseases").map((disease) => (
                                    <TableRow key={disease.name}>
                                        <TableCell
                                            className="w-1/3">{disease.name}
                                        </TableCell>
                                        <TableCell
                                            className="w-1/3">{format(disease.diagnosedAt, "P")}
                                        </TableCell>
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
                    {/*
                    <FormField
                        control={form.control}
                        name="medicines"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Medicines</FormLabel>
                                <FormControl>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <div className={"w-full pt-8"}>
                                                <Button className={"w-full h-full"} type={"button"} inputMode={"none"}
                                                        variant={"ghost"}>
                                                    <Table className={"w-full border border-gray-700"}>
                                                        <TableCaption>A list of added diseases.</TableCaption>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead className="w-1/4">Name</TableHead>
                                                                <TableHead className="w-1/4">Date</TableHead>
                                                                <TableHead className="w-1/4">Taken since</TableHead>
                                                                <TableHead className="w-1/4">Edit</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {medicines && medicines.length !== 0?
                                                                medicines?.map((medicine) => (
                                                                <TableRow key={medicine.id}>
                                                                    <TableCell
                                                                        className="w-1/4">{medicine.name}</TableCell>
                                                                    <TableCell
                                                                        className="w-1/4">{medicine.dose}</TableCell>
                                                                    <TableCell
                                                                        className="w-1/4">{format(medicine.takenSince, "yyyy-MM-dd")}</TableCell>
                                                                    <TableCell className="w-1/4">
                                                                        <Button type={"button"} variant={"destructive"}
                                                                                onClick={() => {
                                                                                    //const updatedMedicines = medicines.filter((m) => m.id !== medicine.id);
                                                                                    //setMedicines(updatedMedicines);
                                                                                }}>Remove</Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )): (
                                                                    <TableRow>
                                                                        <TableCell className="w-1/4">Nothing</TableCell>
                                                                        <TableCell className="w-1/4">added</TableCell>
                                                                        <TableCell className="w-1/4">yet</TableCell>
                                                                    </TableRow>
                                                                )
                                                            }
                                                        </TableBody>
                                                    </Table>
                                                </Button>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[800px] h-full overflow-auto">
                                            <DialogHeader>
                                                <DialogTitle>Edit profile</DialogTitle>
                                                <DialogDescription>
                                                </DialogDescription>
                                            </DialogHeader>
                                            <Form {...medicineForm}>
                                                <form>
                                                    {//onSubmit={medicineForm.handleSubmit(onMedicineSubmit)}>
                                                    }
                                                    <InputMedicinesHandler medicines={medicines}
                                                                           setMedicines={setMedicines}
                                                                           form={medicineForm}
                                                                            onMedicinePressed={onMedicinePressed}/>
                                                </form>
                                            </Form>
                                        </DialogContent>
                                    </Dialog>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />}*/}
                    <Button type="submit"
                    onClick={()=>{
                        toast({
                            title: "Child data successfully added",
                            description: form.getValues("givenName") +" "+ form.getValues("familyName"),
                        })
                    }}>Submit</Button>
                </form>
            </Form>
        </div>
    );
}

export default ChildForm;
