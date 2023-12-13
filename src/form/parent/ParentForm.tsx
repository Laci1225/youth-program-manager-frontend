import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input";
import React, {FormEvent, useEffect, useState} from "react";
import {useForm} from "react-hook-form"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/components/ui/use-toast";
import {ScrollArea} from "@/components/ui/scroll-area"
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import LoadingButton from "@/components/loading-button";
import {parentSchema} from "@/form/parent/parentSchema";
import addParent from "@/api/graphql/parent/addParent";
import {InputPhoneNumbersHandler} from "@/form/parent/InputPhoneNumbersHandler";
import updateParent from "@/api/graphql/parent/updateParent";
import {ParentData} from "@/model/parent-data";
import {Button} from "@/components/ui/button";
import {XIcon} from "lucide-react";
import {ChildData} from "@/model/child-data";
import getPotentialChildren from "@/api/graphql/parent/getPotentialChildren";
import {format} from "date-fns";

interface ParentFormProps {
    onParentModified: (parent: ParentData) => void;
    existingParent?: ParentData
    isOpen: boolean
    onOpenChange: (open: boolean) => void;
}

function ParentForm({onParentModified, existingParent, isOpen, onOpenChange}: ParentFormProps) {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const form = useForm<z.infer<typeof parentSchema>>({
        resolver: zodResolver(parentSchema),
        defaultValues: {
            familyName: existingParent?.familyName,
            givenName: existingParent?.givenName,
            phoneNumbers: existingParent?.phoneNumbers,
            address: existingParent?.address,
        },
    })

    function onSubmit(values: z.infer<typeof parentSchema>) {
        setIsSubmitting(true)
        console.log(values)
        if (existingParent) {
            updateParent(existingParent.id, values)
                .then((result) => {
                    onParentModified(result)
                    toast({
                        title: "The parent is successfully updated",
                        description: `A parent with name: ${form.getValues("givenName")} ${form.getValues("familyName")} updated`,
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
            addParent(values)
                .then((result) => {
                    onParentModified(result)
                    console.log(result)
                    toast({
                        title: "The parent is successfully added",
                        description: `A parent with name: ${form.getValues("givenName")} ${form.getValues("familyName")} created`,
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
            familyName: existingParent?.familyName ?? "",
            givenName: existingParent?.givenName ?? "",
            phoneNumbers: existingParent?.phoneNumbers,
            address: existingParent?.address ?? "",
        })
    }, [existingParent])

    const [selectedChild, setSelectedChild] = useState<string | undefined>(undefined)
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [children, setChildren] = useState<ChildData[]>([])

    function potentialChildren(event: FormEvent<HTMLInputElement>) {
        const name = event.currentTarget.value
        if (name) {
            setIsSelectOpen(name.length > 0);
            setTimeout(() => {
                getPotentialChildren(name)
                    .then(value => setChildren(value))
                    .catch(reason => {
                        console.error("Failed to get potential children:", reason);
                    });
            }, 500);
        } else {
            setSelectedChild(undefined);
            setIsSelectOpen(false);
            setChildren([]);
        }
    }

    function onChildSelected(id: string) {
        setSelectedChild(id)
        form.setValue('childId', id)
        setIsSelectOpen(false)
        console.log(form.getValues('childId'))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] h-[90vh] shadow-muted-foreground">
                <DialogHeader>
                    <DialogTitle>{existingParent ? "Update" : "Create"} a parent</DialogTitle>
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
                                <FormField
                                    control={form.control}
                                    name="childId"
                                    render={({field}) => (
                                        <FormItem className={"flex-1"}>
                                            <FormLabel>Parent</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type="text"
                                                        value={
                                                            selectedChild ? `${(children
                                                                    ?.find(value => value.id === selectedChild)
                                                                    ?.familyName)} ${(children
                                                                    ?.find(value => value.id === selectedChild)
                                                                    ?.givenName)}`
                                                                : selectedChild === "" ? "" : undefined}
                                                        onChange={potentialChildren}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Backspace') {
                                                                setSelectedChild(undefined);
                                                            }
                                                        }}
                                                        placeholder="Search..."
                                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                                                    />
                                                    {isSelectOpen && (
                                                        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md">
                                                            {children?.map(option => (
                                                                <li
                                                                    key={option.id}
                                                                    onClick={() => onChildSelected(option.id)}
                                                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                                                >
                                                                    {option.givenName} {option.familyName} {option.birthDate ? format(new Date(option.birthDate), 'P') : undefined}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                    {(
                                                        <Button
                                                            type="button"
                                                            variant={"ghost"}
                                                            className="absolute top-1 right-1 text-red-500 p-0 mt-1 mr-1 h-fit"
                                                            onClick={() => {
                                                                setSelectedChild("");
                                                                form.setValue('childId', undefined);
                                                            }}
                                                        >
                                                            <XIcon/>
                                                        </Button>
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phoneNumbers"
                                    render={({field}) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Phone numbers*</FormLabel>
                                            <FormControl>
                                                <InputPhoneNumbersHandler {...field}
                                                                          errors={form.formState.errors.phoneNumbers || []}
                                                />
                                            </FormControl>
                                            <FormMessage
                                                hidden={typeof form.formState.errors.phoneNumbers?.message === 'undefined'}/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({field}) => (
                                        <FormItem className={"flex-1"}>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Address" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </ScrollArea>
                        <DialogFooter>
                            <LoadingButton isLoading={isSubmitting}>
                                {existingParent ? "Update" : "Create"}
                            </LoadingButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default ParentForm;
