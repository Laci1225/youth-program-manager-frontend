import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React from "react";
import {useForm} from "react-hook-form"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {formSchema} from "@/form/formSchema";
import {InputDiseaseHandler} from "@/form/InputDiseaseHandler";
import {InputMedicinesHandler} from "@/form/InputMedicinesHandler";
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

    function onSubmit(values: z.infer<typeof formSchema>) {

        console.log(values)
        addChild(values)
            .then((result) => {
                const addedChild = result.data.addChild;
                console.log(addedChild);
            });
        toast({
            title: "The child is successfully added",
            description: form.getValues("givenName") + " " + form.getValues("familyName"),
        })
    }

    return (
        <div className={"container"}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                      className="flex justify-center flex-col space-y-4">
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
                                        <CalendarInput {...field}/>
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
                                <ShowTable tableFields={["name", "diagnosedAt"]} {...field}/>
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
                                    <InputMedicinesHandler form={form}/>
                                </FormControl>
                                <FormMessage/>
                                <ShowTable tableFields={["Name", "Dose", "Taken since"]} {...field}/>
                            </FormItem>
                        )}
                    />
                    <Button className="sticky bottom-0 p-4" type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
}

export default ChildForm;
