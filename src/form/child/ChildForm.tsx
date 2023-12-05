import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input";
import {Button, ButtonProps} from "@/components/ui/button";
import React, {ReactNode, useState} from "react";
import {useForm} from "react-hook-form"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {childSchema} from "@/form/child/childSchema";
import {InputDiseaseHandler} from "@/form/child/InputDiseaseHandler";
import {InputMedicinesHandler} from "@/form/child/InputMedicinesHandler";
import {toast} from "@/components/ui/use-toast";
import addChild from "@/api/graphql/child/addChild";
import CalendarInput from "@/form/CalendarInput";
import ShowTable from "@/form/ShowTable";
import {ScrollArea} from "@/components/ui/scroll-area"
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {ChildData} from "@/model/child-data";
import LoadingButton from "@/components/loading-button";

interface ChildFormProps {
    onChildCreated: (child: ChildData) => void;
    existingChild?: ChildData
    triggerName: ReactNode
    triggerVariant?: ButtonProps["variant"]
}


function ChildForm({onChildCreated, existingChild, triggerName, triggerVariant}: ChildFormProps) {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const form = useForm<z.infer<typeof childSchema>>({
        resolver: zodResolver(childSchema),
        defaultValues: {
            familyName: existingChild?.familyName,
            givenName: existingChild?.givenName,
            birthDate: existingChild?.birthDate ? new Date(existingChild.birthDate) : undefined,
            birthPlace: existingChild?.birthPlace,
            address: existingChild?.address,
            diagnosedDiseases: existingChild?.diagnosedDiseases,
            regularMedicines: existingChild?.regularMedicines
        },
    })

    const [isDialogOpen, setDialogOpen] = useState(false);

    function onSubmit(values: z.infer<typeof childSchema>) {
        setIsSubmitting(true)
        addChild(values)
            .then((result) => {
                onChildCreated(result)
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
                }} variant={triggerVariant}
                >{triggerName}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] h-[90vh] shadow-muted-foreground">
                <DialogHeader>
                    <DialogTitle>Create a child</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                          className="flex justify-center flex-col space-y-4 mx-4">
                        <ScrollArea className="h-[70vh]">
                            <div className="mx-4">
                                <div className="flex">
                                    <FormField
                                        control={form.control}
                                        name="familyName"
                                        render={({field}) => (
                                            <FormItem className="flex-1">
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
                                            <FormItem className="flex-1">
                                                <FormLabel>Given name*</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Given name" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex">
                                    <FormField
                                        control={form.control}
                                        name="birthDate"
                                        render={({field}) => (
                                            <FormItem className="flex-1">
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
                                            <FormItem className="flex-1">
                                                <FormLabel>Birth place*</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Birth place" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({field}) => (
                                        <FormItem className={"flex-1"}>
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
                                            <div className="flex justify-between">
                                                <FormLabel>Diagnosed diseases</FormLabel>
                                                <FormControl>
                                                    <InputDiseaseHandler {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </div>
                                            <ShowTable tableFields={["Name", "Diagnosed at"]} {...field}
                                                       showDeleteButton/>
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
                                            <ShowTable tableFields={["Name", "Dose", "Taken since"]} {...field}
                                                       showDeleteButton/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </ScrollArea>
                        <DialogFooter>
                            <LoadingButton type="submit" isLoading={isSubmitting}/>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default ChildForm;
