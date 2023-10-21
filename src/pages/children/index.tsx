import Image from 'next/image'
import {Form, FormProvider, useForm} from "react-hook-form";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {format} from "date-fns"
import {cn} from "@/lib/utils"
import {Calendar} from "@/components/ui/calendar"
import {Calendar as CalendarIcon} from "lucide-react"

function Children() {
    const nameSchema = z.string().min(2, 'Name must be at least 2 characters.');
    const dateSchema = z.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, 'Invalid date format');
    const doseSchema = z.string().min(2, 'Dose must be at least 2 characters.');
    const formSchema = z.object({
        familyName: nameSchema,
        givenName: nameSchema,
        birthDate: dateSchema,
        birthPlace: z.string().min(2, 'Birth Place must be at least 2 characters.'),
        address: z.string().min(2, 'Address must be at least 2 characters.'),
        diseases:
            z.object({
                    name: nameSchema,
                    date: dateSchema.optional(),
                }
            ),
        medicines: z.object({
                name: nameSchema,
                dose: doseSchema,
                takenSince: dateSchema.optional(),
            }
        ).optional(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            familyName: "",
            givenName: "",
            birthDate: "",
            birthPlace: "",
            address: "",
            diseases: {name: "", date: ""},
            medicines: {name: "", dose: "", takenSince: ""}
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }

    const methods = useForm()
    const [date, setDate] = React.useState<Date>()
    const [showDiseaseForm, setShowDiseaseForm] = useState(false);
    const [showMedicineForm, setShowMedicineForm] = useState(false);

    return (<div className={"container w-4/6 "}>
            <FormProvider {...methods}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-center flex-col space-y-8">
                    <FormField
                        control={form.control}
                        name="familyName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Family name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Family name" {...field} />
                                </FormControl>
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
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="birthDate"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Birthdate</FormLabel>
                                <FormControl>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[280px] justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                initialFocus
                                                defaultMonth={new Date(2010, 1)}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FormControl>
                            </FormItem>
                        )}
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
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="diseases.name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Diseases</FormLabel>
                                <FormControl>
                                    <Button onClick={() => setShowDiseaseForm(true)}>Edit</Button>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Medicines Form Pop-up */}
                    <FormField
                        control={form.control}
                        name="medicines.name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Medicines</FormLabel>
                                <FormControl>
                                    <Button onClick={() => setShowMedicineForm(true)}>Edit</Button>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </FormProvider>
            {showDiseaseForm && (
                <div>
                </div>
            )}

            {showMedicineForm && (
                <div>
                </div>
            )}
        </div>
    );
}

export default Children;
