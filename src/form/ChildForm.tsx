import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
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
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {ChildData} from "@/model/child-data";
import SubmitButton from "@/components/ui/submit-button";

interface ChildFormProps {
    onChildCreated: (child: ChildData) => void;
}


function ChildForm({onChildCreated}: ChildFormProps) {

    const [isSubmitting, setIsSubmitting] = useState(false)
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
        setIsSubmitting(true)

        addChild(values)
            .then((result) => {
                const addedChild = result.data.addChild;

                onChildCreated(addedChild)
                toast({
                    title: "The child is successfully added",
                    description: `A child with name: ${form.getValues("givenName")} ${form.getValues("familyName")} created`,
                })
                setDialogOpen(false)
            }).catch(reason => {
            toast({
                variant: "destructive",
                title: reason.toString(),
            })
        }).finally(() => {
            setIsSubmitting(false)
        })
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => {
                    setDialogOpen(true)
                    form.reset()
                }}>+ Add</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] h-[90vh] shadow-muted-foreground">
                <DialogHeader>
                    <DialogTitle>Create a child</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                          className="flex justify-center flex-col space-y-4 mx-4">
                        <ScrollArea className="h-[70vh] ">
                            <div className="mx-4">
                                <div className="flex flex-row flex-wrap">
                                    <FormField
                                        control={form.control}
                                        name="familyName"
                                        render={({field}) => (
                                            <FormItem className="w-1/2">
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
                                            <FormItem className="w-1/2">
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
                                        render={({field}) => (
                                            <FormItem className="w-1/2">
                                                <FormLabel>Birthdate*</FormLabel>
                                                <FormControl>
                                                    <CalendarInput {...field} shownYear={2010}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="birthPlace"
                                        render={({field}) => (
                                            <FormItem className="w-1/2">
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
                                            <FormItem className={"w-full"}>
                                                <FormLabel>Address*</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Address" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="diagnosedDiseases"
                                    render={({field}) => (
                                        <FormItem>
                                            <div className="flex justify-between">
                                                <FormLabel>Diagnosed diseases</FormLabel>
                                                <FormControl>
                                                    <InputDiseaseHandler {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </div>
                                            <ShowTable tableFields={["Name", "Diagnosed at"]} {...field}/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="regularMedicines"
                                    render={({field}) => (
                                        <FormItem>
                                            <div className="flex justify-between">
                                                <FormLabel>Regular medicines</FormLabel>
                                                <FormControl>
                                                    <InputMedicinesHandler {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </div>
                                            <ShowTable tableFields={["Name", "Dose", "Taken since"]} {...field}/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </ScrollArea>
                        <DialogFooter>
                            <SubmitButton isLoading={isSubmitting}/>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default ChildForm;
