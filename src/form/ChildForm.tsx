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


function ChildForm() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            familyName: "",
            givenName: "",
            birthDate: undefined,
            birthPlace: "",
            address: "",
            diseases: [{name: undefined, diagnosedAt: undefined}],
            //medicines: [{name: "", dose: "", takenSince: undefined}]
        },
    })
    const medicineForm = useForm<z.infer<typeof medicineSchema>>({
        resolver: zodResolver(medicineSchema),
        defaultValues: {
            medicines: [{name: "", dose: "", takenSince: undefined}]
        }
    })
    const diseaseForm = useForm<z.infer<typeof diseaseSchema>>({
        resolver: zodResolver(diseaseSchema),
        defaultValues: {
            diseases: [{name: undefined, diagnosedAt: undefined}],
        }
    })

    function onDiseaseSubmit(values: z.infer<typeof diseaseSchema>) {

        form.setValue("diseases", values.diseases,{shouldValidate: true,shouldTouch: true})
        const diseases = form.getValues("diseases")
        let tempDiseases = new Set(diseases)
        form.setValue("diseases", Array.from(tempDiseases),{shouldValidate: true,shouldTouch: true})

    }
    function onMedicineSubmit(values: z.infer<typeof medicineSchema>) {
        form.setValue("medicines", values.medicines,{shouldValidate: true})
        const medicines = form.getValues("medicines")
        let tempMedicines = new Set(medicines) //todo
        form.setValue("medicines", Array.from(tempMedicines),{shouldValidate: true,shouldTouch: true})
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        client
            .mutate({
                mutation: gql(`
                mutation AddChild($child: ChildInput!) {
                    addChild(child: $child) {
                        id
                        familyName
                        givenName
                        birthDate
                        birthPlace
                        address
                        diagnosedDiseases {
                            name
                            diagnosedAt
                        }
                        regularMedicines {
                            name
                            dose
                            takenSince
                        }
                        createdDate
                        modifiedDate
                    }
                }
            `),
                variables: {
                    child: {
                        familyName: values.familyName,
                        givenName: values.givenName,
                        birthDate: values.birthDate,
                        birthPlace: values.birthPlace,
                        address: values.address,
                        diagnosedDiseases: values.diseases.map(disease => ({
                            name: disease.name,
                            diagnosedAt: disease.diagnosedAt
                        })),
                        regularMedicines: values.medicines?.map(medicine => ({
                            name: medicine.name,
                            dose: medicine.dose,
                            takenSince: medicine?.takenSince,
                        })),
                    },
                },
            })
            .then((result) => {
                const addedChild = result.data.addChild;
                console.log(addedChild);
            });
        //router.push("children")
    }


    const [birthDate, setBirthDate] = useState<Date>()

    const [diseases, setDiseases] = useState<Disease[]>([]);
    const [medicines, setMedicines] = useState<Medicine[]>([]);

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
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[280px] justify-start text-left font-normal",
                                                        !birthDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4"/>
                                                    {birthDate ? format(birthDate, "yyyy-MM-dd") :
                                                        <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode={"single"}
                                                    initialFocus
                                                    selected={birthDate}
                                                    onSelect={(newDate) => {
                                                        form.setValue("birthDate", newDate ? newDate : new Date(), {shouldValidate: true});
                                                        setBirthDate(newDate);
                                                    }}
                                                    defaultMonth={new Date(2010, 1)}
                                                    toMonth={new Date()}
                                                />
                                                <PopoverClose>
                                                    X //TODO
                                                </PopoverClose>
                                            </PopoverContent>

                                        </Popover>
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
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <div className={"w-full pt-8"}>
                                                <Button className={"w-full h-full"} type={"button"} inputMode={"none"}
                                                        variant={"ghost"}>
                                                    <Table className={"w-full border border-gray-700"}>
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
                                                                diseases &&  diseases.length !== 0 ? (
                                                                    diseases.map((disease) => (
                                                                        <TableRow key={0}>
                                                                            <TableCell
                                                                                className="w-1/3">{disease.name}</TableCell>
                                                                            <TableCell
                                                                                className="w-1/3">{format(disease.diagnosedAt, "yyyy-MM-dd")}</TableCell>
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
                                                </Button>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[800px] h-full overflow-auto">
                                            <DialogHeader>
                                                <DialogTitle>Edit profile</DialogTitle>
                                                <DialogDescription>
                                                </DialogDescription>
                                            </DialogHeader>
                                            <Form {...diseaseForm}>
                                                <form onSubmit={diseaseForm.handleSubmit(onDiseaseSubmit,()=>"Other string")}>
                                                    <InputDiseaseHandler diseases={diseases}
                                                                         setDiseases={setDiseases}
                                                                         form={diseaseForm}/>
                                                </form>
                                            </Form>
                                            <DialogFooter>
                                                <Button type="submit">Save changes</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
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
                                                                <TableRow key={0}>
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
                                                <form onSubmit={medicineForm.handleSubmit(onMedicineSubmit)}>
                                                    <InputMedicinesHandler medicines={medicines}
                                                                           setMedicines={setMedicines}
                                                                           form={medicineForm}/>
                                                </form>
                                            </Form>
                                        </DialogContent>
                                    </Dialog>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
}

export default ChildForm;
