import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/components/ui/use-toast";
import {ScrollArea} from "@/components/ui/scroll-area"
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import LoadingButton from "@/components/loading-button";
import addTicket from "@/api/graphql/ticket/addTicket";
import {TicketData} from "@/model/ticket-data";
import {ticketSchema} from "@/form/ticket/ticketSchema";

interface TicketFormProps {
    onTicketModified: (ticket: TicketData) => void;
    existingTicket?: TicketData
    isOpen: boolean
    onOpenChange: (open: boolean) => void;
}

function TicketForm({onTicketModified, existingTicket, isOpen, onOpenChange}: TicketFormProps) {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const form = useForm<z.infer<typeof ticketSchema>>({
        resolver: zodResolver(ticketSchema),
        defaultValues: {
            name: existingTicket?.name,
            description: existingTicket?.description,
            price: existingTicket?.price,
            numberOfParticipants: existingTicket?.numberOfParticipants,
            standardValidityPeriod: existingTicket?.standardValidityPeriod,
        },
    })

    function onSubmit(values: z.infer<typeof ticketSchema>) {
        console.log(values)
        setIsSubmitting(true)
        //if (existingTicket) {
        /* updateTicket(existingTicket.id, values)
             .then((result) => {
                 onTicketModified(result)
                 toast({
                     title: "The ticket is successfully updated",
                     description: `A ticket with name: ${form.getValues("givenName")} ${form.getValues("familyName")} updated`,
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
     } else */
        addTicket(values)
            .then((result) => {
                onTicketModified(result)
                toast({
                    title: "The ticket is successfully added",
                    description: `A ticket with name: ${form.getValues("name")} created`,
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


    useEffect(() => {
        form.reset({
            name: existingTicket?.name,
            description: existingTicket?.description,
            price: existingTicket?.price,
            numberOfParticipants: existingTicket?.numberOfParticipants,
            standardValidityPeriod: existingTicket?.standardValidityPeriod,
        })
    }, [existingTicket])

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] h-[90vh] shadow-muted-foreground">
                <DialogHeader>
                    <DialogTitle>{existingTicket ? "Update" : "Create"} a ticket</DialogTitle>
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
                                                <Input placeholder="Description" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({field}) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Price*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Price"
                                                       type="number" {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="numberOfParticipants"
                                    render={({field}) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Number Of Participants*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Number Of Participants" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="standardValidityPeriod"
                                    render={({field}) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Standard Validity Period*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Standard Validity Period" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </ScrollArea>
                        <DialogFooter>
                            <LoadingButton isLoading={isSubmitting}>
                                {existingTicket ? "Update" : "Create"}
                            </LoadingButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default TicketForm;
