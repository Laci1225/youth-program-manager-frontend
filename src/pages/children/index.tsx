import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {ControllerRenderProps, useForm, UseFormReturn} from "react-hook-form"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {format} from "date-fns"
import {cn} from "@/lib/utils"
import {Calendar} from "@/components/ui/calendar"
import {Calendar as CalendarIcon} from "lucide-react"
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {formSchema} from "@/form/formSchema";
import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {ChildData} from "@/model/child-data";
import {Disease, InputDiseaseHandler, Medicines} from "@/form/InputDiseaseHandler";
import {InputMedicinesHandler} from "@/form/InputMedicinesHandler";


function Children() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            familyName: "",
            givenName: "",
            birthDate: "",
            birthPlace: "",
            address: "",
            /*diseases: {name: "", date: ""},
            medicines: {name: "", dose: "", takenSince: ""}*/
        },
    })

    const [children, setChildren] = useState<ChildData[]>()

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        /*client
        .query({
            query: gql`
                query GetLocations {
                    children {
                        givenName
                    }
                }
            `,
        })
        .then((result) => console.log(result.data.children));
    */
    }

    const [date, setDate] = useState<Date>()
    const [showDiseaseForm, setShowDiseaseForm] = useState(false);
    const [showMedicineForm, setShowMedicineForm] = useState(false);

    const [diseases, setDiseases] = useState<Disease>({name: "sds", date: "asd"});
    const [medicines, setMedicines] = useState<Medicines>({name: "sds", dose: "asd", takenSince: ""});


    return (<div className={"container w-4/6 "}>
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
                                                        !date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4"/>
                                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode={"single"}
                                                    initialFocus
                                                    selected={date}
                                                    onSelect={(newDate) => {
                                                        form.setValue("birthDate", newDate);
                                                        setDate(newDate);
                                                    }}
                                                    defaultMonth={new Date(2010, 1)}
                                                    toMonth={new Date()}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
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
                        name="diseases"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Diseases </FormLabel>
                                <FormControl>
                                    <InputDiseaseHandler field={field} diseases={diseases}
                                                         setDiseases={setDiseases}
                                                         setShowDiseaseForm={setShowDiseaseForm}
                                                         showDiseaseForm={showDiseaseForm} form={form}/>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="medicines"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Medicines </FormLabel>
                                <FormControl>
                                    <InputMedicinesHandler field={field} medicines={medicines}
                                                           setMedicines={setMedicines} setShowMedicinesForm={setShowMedicineForm}
                                                           showMedicinesForm={showMedicineForm} form={form}/>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
}

export default Children;
