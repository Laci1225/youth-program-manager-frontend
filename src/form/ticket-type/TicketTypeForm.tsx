import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input";
import React, {useContext, useEffect, useState} from "react";
import {useForm} from "react-hook-form"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/components/ui/use-toast";
import {ScrollArea} from "@/components/ui/scroll-area"
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import LoadingButton from "@/components/loading-button";
import addTicketType from "@/api/graphql/ticketType/addTicketType";
import {TicketTypeData} from "@/model/ticket-type-data";
import {ticketTypeSchema} from "@/form/ticket-type/ticketTypeSchema";
import {Textarea} from "@/components/ui/textarea"
import updateTicketType from "@/api/graphql/ticketType/updateTicketType";
import AccessTokenContext from "@/context/access-token-context";


interface TicketFormProps {
    onTicketTypeModified: (ticketType: TicketTypeData) => void;
    existingTicketType?: TicketTypeData
    isOpen: boolean
    onOpenChange: (open: boolean) => void;
}

function TicketTypeForm({onTicketTypeModified, existingTicketType, isOpen, onOpenChange}: TicketFormProps) {
    const accessToken = useContext(AccessTokenContext)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const form = useForm<z.infer<typeof ticketTypeSchema>>({
        resolver: zodResolver(ticketTypeSchema),
        defaultValues: {
            name: existingTicketType?.name,
            description: existingTicketType?.description,
            price: existingTicketType?.price,
            numberOfParticipation: existingTicketType?.numberOfParticipation,
            standardValidityPeriod: existingTicketType?.standardValidityPeriod,
        },
    })

    function onSubmit(values: z.infer<typeof ticketTypeSchema>) {
        setIsSubmitting(true)
        if (existingTicketType) {
            updateTicketType(existingTicketType.id, values, accessToken)
                .then((result) => {
                    onTicketTypeModified(result)
                    toast({
                        title: "The ticket is successfully updated",
                        description: `A ticket with name: ${form.getValues("name")} updated`,
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
        } else
            addTicketType(values, accessToken)
                .then((result) => {
                    onTicketTypeModified(result)
                    toast({
                        title: "The ticket is successfully added",
                        description: `A ticket with name: ${form.getValues("name")} created`,
                        duration: 2000
                    })
                    onOpenChange(false)
                }).catch(reason => {
                toast({
                    variant: "destructive",
                    title: reason.message,
                    duration: 2000
                })
            }).finally(() => {
                setIsSubmitting(false)
            })
    }


    useEffect(() => {
        form.reset({
            name: existingTicketType?.name,
            description: existingTicketType?.description,
            price: existingTicketType?.price,
            numberOfParticipation: existingTicketType?.numberOfParticipation,
            standardValidityPeriod: existingTicketType?.standardValidityPeriod,
        })
    }, [existingTicketType])

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] h-[90vh] shadow-muted-foreground">
                <DialogHeader>
                    <DialogTitle>{existingTicketType ? "Update" : "Create"} a ticket type</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}
                          className="flex justify-center flex-col space-y-4 mx-4">
                        <ScrollArea className="h-[70vh]">
                            <div className="mx-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Name*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({field}) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Description*</FormLabel>
                                            <FormControl>
                                                <Textarea {...field}
                                                          placeholder="Type a few sentences about the course here."
                                                          className="h-12 max-h-32 overflow-hidden"
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <div className="flex w-full justify-between">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({field}) => (
                                            <FormItem className="w-48">
                                                <FormLabel>Price*</FormLabel>
                                                <FormControl>
                                                    <div className="relative w-36">
                                                        <Input
                                                            placeholder="12500"
                                                            {...field}
                                                            className="pr-5"
                                                        />
                                                        <span
                                                            className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                        HUF
                                                    </span>
                                                    </div>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="numberOfParticipation"
                                        render={({field}) => (
                                            <FormItem className="w-48">
                                                <FormLabel>Number Of Participation*</FormLabel>
                                                <FormControl>
                                                    <div className="relative w-24">
                                                        <Input
                                                            placeholder="12"
                                                            {...field}
                                                            className="pr-10"
                                                        />
                                                        <span
                                                            className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                        pc(s)
                                                    </span>
                                                    </div>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="standardValidityPeriod"
                                        render={({field}) => (
                                            <FormItem className="w-48">
                                                <FormLabel>Standard Validity Period*</FormLabel>
                                                <FormControl>
                                                    <div className="relative w-24">
                                                        <Input
                                                            placeholder="123"
                                                            {...field}
                                                            className="pr-[3.25rem]"
                                                        />
                                                        <span
                                                            className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                        day(s)
                                                    </span>
                                                    </div>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </ScrollArea>
                        <DialogFooter>
                            <LoadingButton isLoading={isSubmitting}>
                                {existingTicketType ? "Update" : "Create"}
                            </LoadingButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default TicketTypeForm;
