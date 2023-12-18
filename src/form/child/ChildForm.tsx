import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input";
import React, {FormEvent, useEffect, useRef, useState} from "react";
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
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {ChildData} from "@/model/child-data";
import LoadingButton from "@/components/loading-button";
import updateChild from "@/api/graphql/child/updateChild";
import {parseDateInDisease, parseDateInMedicine} from "@/utils/child";
import getPotentialParents from "@/api/graphql/child/getPotentialParents";
import {ParentData} from "@/model/parent-data";
import {Button} from "@/components/ui/button";
import {XIcon} from "lucide-react";
import {Check, ChevronsUpDown} from "lucide-react"
import {cn} from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {Option} from "commander";
import {AutoComplete} from "@/form/child/Autocomplete";

interface ChildFormProps {
    onChildModified: (child: ChildData) => void;
    existingChild?: ChildData
    isOpen: boolean
    onOpenChange: (open: boolean) => void;
}


function ChildForm({
                       onChildModified,
                       existingChild,
                       isOpen,
                       onOpenChange
                   }: ChildFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const form = useForm<z.infer<typeof childSchema>>({
        resolver: zodResolver(childSchema),
        defaultValues: {
            familyName: existingChild?.familyName,
            givenName: existingChild?.givenName,
            birthDate: existingChild?.birthDate ? new Date(existingChild.birthDate) : undefined,
            birthPlace: existingChild?.birthPlace,
            address: existingChild?.address,
            relativeParents: [],
            diagnosedDiseases: parseDateInDisease(existingChild?.diagnosedDiseases),
            regularMedicines: parseDateInMedicine(existingChild?.regularMedicines)
        },
    })

    function onSubmit(values: z.infer<typeof childSchema>) {
        setIsSubmitting(true)
        if (existingChild) {
            updateChild(existingChild.id, values)
                .then((result) => {
                    onChildModified(result)
                    toast({
                        title: "The child is successfully updated",
                        description: `A child with name: ${form.getValues("givenName")} ${form.getValues("familyName")} updated`,
                        duration: 2000
                    })
                    onOpenChange(false)
                }).catch(reason => {
                toast({
                    variant: "destructive",
                    title: reason.toString(),
                    duration: 2000
                })
            }).finally(() => {
                setIsSubmitting(false)
            })
        } else {
            addChild(values)
                .then((result) => {
                    onChildModified(result)
                    console.log(result)
                    toast({
                        title: "The child is successfully added",
                        description: `A child with name: ${form.getValues("givenName")} ${form.getValues("familyName")} created`,
                        duration: 2000
                    })
                    onOpenChange(false)
                }).catch(reason => {
                toast({
                    variant: "destructive",
                    title: reason.toString(),
                    duration: 2000
                })
            }).finally(() => {
                setIsSubmitting(false)
            })
        }
    }

    useEffect(() => {
        form.reset({
            familyName: existingChild?.familyName ?? "",
            givenName: existingChild?.givenName ?? "",
            birthDate: existingChild?.birthDate ? new Date(existingChild.birthDate) : undefined,
            birthPlace: existingChild?.birthPlace ?? "",
            address: existingChild?.address ?? "",
            diagnosedDiseases: existingChild ? parseDateInDisease(existingChild?.diagnosedDiseases) : [],
            regularMedicines: existingChild ? parseDateInMedicine(existingChild?.regularMedicines) : []
        })
    }, [existingChild]);
    const [parents, setParents] = useState<ParentData[]>()
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    function potentialParents(event: FormEvent<HTMLInputElement>) {
        const name = event.currentTarget.value
        setMessage(name);
        if (name) {
            setIsSelectOpen(name.length > 0);
            setTimeout(() => {
                getPotentialParents(name)
                    .then(value => setParents(value))
                    .catch(reason => {
                        console.error("Failed to get potential parents:", reason);
                    });
            }, 500);
        } else {
            setIsSelectOpen(false);
            setParents([]);
        }
    }

    const [value, setValue] = useState("")

    const [message, setMessage] = useState<string | undefined>(undefined)
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] h-[90vh] shadow-muted-foreground">
                <DialogHeader>
                    <DialogTitle>{existingChild ? "Update" : "Create"} a child</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}
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
                                    name="relativeParents"
                                    render={({field}) => (
                                        <FormItem className={"flex-1"}>
                                            <FormLabel>Parent</FormLabel>
                                            <FormControl>
                                                <AutoComplete
                                                    key={0}
                                                    isLoading={false}
                                                    disabled={false}
                                                    onValueChange={(value) => {
                                                        field.onChange([{
                                                            id: value.id,
                                                            isEmergencyContact: true
                                                        }])
                                                    }}
                                                    placeholder={"Select parents..."}
                                                    emptyMessage={"No parent found"}
                                                />
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
                            <LoadingButton isLoading={isSubmitting}>
                                {existingChild ? "Update" : "Create"}
                            </LoadingButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default ChildForm;
