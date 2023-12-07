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
import {Textarea} from "@/components/ui/textarea"


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
                    <form onSubmit={form.handleSubmit(onSubmit, (errors, event) => {
                            console.log(errors)
                            console.log(event)
                        }
                    )}
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
                                <div className={"flex w-full justify-between"}>
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({field}) => (
                                            <FormItem className="w-36">
                                                <FormLabel>Price*</FormLabel>
                                                <FormControl>
                                                    <div className="relative w-24">
                                                        <Input
                                                            placeholder="12.5"
                                                            {...field}
                                                            className="pr-5"
                                                        />
                                                        <span
                                                            className="absolute text-black inset-y-0 right-0 flex items-center pr-2 text-muted">
                                                        €
                                                    </span>
                                                    </div>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="numberOfParticipants"
                                        render={({field}) => (
                                            <FormItem className="w-48">
                                                <FormLabel>Number Of Participants*</FormLabel>
                                                <FormControl>
                                                    <div className="relative w-20">
                                                        <Input
                                                            placeholder="12"
                                                            {...field}
                                                            className="pr-10"
                                                        />
                                                        <span
                                                            className="absolute text-black inset-y-0 right-0 flex items-center pr-2 text-muted">
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
                                                            className="absolute text-black inset-y-0 right-0 flex items-center pr-2 text-muted">
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
