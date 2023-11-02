import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {Dispatch, SetStateAction, useState} from "react";
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
import {ScrollArea} from "@/components/ui/scroll-area"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {ChildData} from "@/model/child-data";
import Spinner from "@/components/ui/spinner";

interface ChildFormProps {
    setChildren: Dispatch<SetStateAction<ChildData[]>>
}

function ChildForm({setChildren}: ChildFormProps) {

    const [receivedAnswer, setReceivedAnswer] = useState(true)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            familyName: "",
            givenName: "",
            birthDate: undefined,
            birthPlace: "",
            address: "",
            diagnosedDiseases: undefined,
            regularMedicines: undefined
        },
    })

    const [isDialogOpen, setDialogOpen] = useState(false);

    function onSubmit(values: z.infer<typeof formSchema>) {
        setReceivedAnswer(false)
        console.log(values)

        addChild(values)
            .then((result) => {
                const addedChild = result.data.addChild;

                setChildren(prevState => [...prevState, addedChild])
                toast({
                    title: "The child is successfully added",
                    description: form.getValues("givenName") + " " + form.getValues("familyName"),
                })
                setReceivedAnswer(true)
                setDialogOpen(false)
            }).catch(reason => {
                toast({
                    variant: "destructive",
                    title: reason.toString(),
                })
                setReceivedAnswer(true)

            }
        )
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => {
                    setDialogOpen(true)
                    form.reset()
                }}>+ Add</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Create a child</DialogTitle>
                </DialogHeader>
                <div className={""}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                              className="flex justify-center flex-col space-y-4 mx-4">
                            <ScrollArea className="h-[80vh] mx-4 overflow-auto">
                                <FormField
                                    control={form.control}
                                    name="familyName"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Family name*</FormLabel>
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
                                            <FormLabel>Given name*</FormLabel>
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
                                                <FormLabel>Birthdate*</FormLabel>
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
                                            <FormLabel>Birth place*</FormLabel>
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
                                            <FormLabel>Address*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Address" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="diagnosedDiseases"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={"block"}>Diagnosed diseases*</FormLabel>
                                            <FormControl>
                                                <InputDiseaseHandler {...field}/>
                                            </FormControl>
                                            <FormMessage/>
                                            <ShowTable tableFields={["Name", "Diagnosed at"]} {...field}/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="regularMedicines"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Regular medicines</FormLabel>
                                            <FormControl>
                                                <InputMedicinesHandler {...field}/>
                                            </FormControl>
                                            <FormMessage/>
                                            <ShowTable tableFields={["Name", "Dose", "Taken since"]} {...field}/>
                                        </FormItem>
                                    )}
                                />
                            </ScrollArea>
                            {receivedAnswer ?
                                <Button type="submit">Submit</Button>
                                : <Spinner/>
                            }
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ChildForm;
