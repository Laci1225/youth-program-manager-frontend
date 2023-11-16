import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input";
import {Button, ButtonProps} from "@/components/ui/button";
import React, {ReactNode, useState} from "react";
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
import LoadingButton from "@/components/loading-button";
import updateChild from "@/api/graphql/updateChild";
import {Disease} from "@/model/disease";
import {Medicine} from "@/model/medicine";

interface ChildFormProps {
    onChildCreated: (child: ChildData) => void;
    existingChild?: ChildData
    triggerName: ReactNode
    triggerVariant?: ButtonProps["variant"]
}


function ChildForm({onChildCreated, existingChild, triggerName, triggerVariant}: ChildFormProps) {
    const parseDateInDisease = (array: Disease[] | undefined): Disease[] | undefined => {
        return array?.map((item: Disease) => {
            if (item.diagnosedAt) {
                return {...item, diagnosedAt: new Date(item.diagnosedAt)};
            }
            return {...item};
        });
    }
    const parseDateInMedicine = (array: Medicine[] | undefined): Medicine[] | undefined => {
        return array?.map((item: Medicine) => {
            if (item.takenSince) {
                return {...item, takenSince: new Date(item.takenSince)};
            }
            return {...item};
        });
    }
    const [isSubmitting, setIsSubmitting] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            familyName: existingChild?.familyName,
            givenName: existingChild?.givenName,
            birthDate: existingChild?.birthDate ? new Date(existingChild.birthDate) : undefined,
            birthPlace: existingChild?.birthPlace,
            address: existingChild?.address,
            diagnosedDiseases: parseDateInDisease(existingChild?.diagnosedDiseases),
            regularMedicines: parseDateInMedicine(existingChild?.regularMedicines)
        },
    })

    const [isDialogOpen, setDialogOpen] = useState(false);

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        if (existingChild) {
            updateChild(existingChild.id, values)
                .then((result) => {
                    onChildCreated(result)
                    toast({
                        title: "The child is successfully updated",
                        description: `A child with name: ${form.getValues("givenName")} ${form.getValues("familyName")} updated`,
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
        } else {
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
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => {
                    setDialogOpen(true)
                    existingChild || form.reset()
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
                                                       showDeleteButton={true}/>
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
                                                       showDeleteButton={true}/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </ScrollArea>
                        <DialogFooter>
                            <LoadingButton type="submit" isLoading={isSubmitting} existingChild={existingChild}/>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default ChildForm;
