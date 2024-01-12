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
import addTicketType from "@/api/graphql/ticketType/addTicketType";
import {TicketTypeData} from "@/model/ticket-type-data";
import {ticketTypeSchema} from "@/form/ticket-type/ticketTypeSchema";
import {Textarea} from "@/components/ui/textarea"
import updateTicketType from "@/api/graphql/ticketType/updateTicketType";
import {ticketSchema} from "@/form/ticket/ticketSchema";
import CalendarInput from "@/form/CalendarInput";
import {AutoComplete} from "@/table/AutoComplete";
import getPotentialParents from "@/api/graphql/child/getPotentialParents";
import {Button} from "@/components/ui/button";
import getPotentialChildren from "@/api/graphql/parent/getPotentialChildren";
import {TicketData} from "@/model/ticket-data";
import updateTicket from "@/api/graphql/ticket/updateTicket";
import addTicket from "@/api/graphql/ticket/addTicket";
import getPotentialTicketTypes from "@/api/graphql/ticket/getPotentialTicketTyoes";


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
        defaultValues: {/*
            name: existingTicket?.name,
            description: existingTicket?.description,
            price: existingTicket?.price,
            numberOfParticipation: existingTicket?.numberOfParticipation,
            standardValidityPeriod: existingTicket?.standardValidityPeriod,*/
        },
    })

    function onSubmit(values: z.infer<typeof ticketSchema>) {
        setIsSubmitting(true)
        if (existingTicket) {
            updateTicket(existingTicket.id, values)
                .then((result) => {
                    onTicketModified(result)
                    toast({
                        title: "The ticket is successfully updated",
                        description: `A ticket with name: ${form.getValues("childId")} updated`,
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
            addTicket(values)
                .then((result) => {
                    onTicketModified(result)
                    toast({
                        title: "The ticket is successfully added",
                        description: `A ticket with name: ${form.getValues("childId")} created`,
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


    useEffect(() => {/*
        form.reset({
            name: existingTicket?.name,
            description: existingTicket?.description,
            price: existingTicket?.price,
            numberOfParticipation: existingTicket?.numberOfParticipation,
            standardValidityPeriod: existingTicket?.standardValidityPeriod,
        })*/
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
                                    name="childId"
                                    render={({field}) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Name*</FormLabel>
                                            <FormControl>
                                                <div className={"flex justify-between"}>
                                                    <AutoComplete
                                                        className={"w-2/3"}
                                                        key={0}
                                                        value={undefined/*autoCompleteValue ?? autoCompleteValue*/}
                                                        isLoading={false}
                                                        disabled={false}
                                                        getPotential={getPotentialChildren}
                                                        isAdded={false}
                                                        onValueChange={(value) => {
                                                            if (value) {
                                                                field.onChange(value.id);
                                                            } else field.onChange(undefined);

                                                        }}
                                                        placeholder={"Select parents..."}
                                                        emptyMessage={"No parent found"}
                                                    />
                                                    <Button type={"button"}
                                                            onClick={() => {
                                                                //handleParentEditClick()
                                                            }}>
                                                        Create
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="ticketTypeId"
                                    render={({field}) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Description*</FormLabel>
                                            <FormControl>
                                                <div className={"flex justify-between"}>
                                                    <AutoComplete
                                                        className={"w-2/3"}
                                                        key={0}
                                                        value={undefined/*autoCompleteValue ?? autoCompleteValue*/}
                                                        isLoading={false}
                                                        disabled={false}
                                                        getPotential={getPotentialTicketTypes}
                                                        isAdded={false}
                                                        onValueChange={(value) => {
                                                            if (value) {
                                                                field.onChange(value.id);
                                                                form.setValue("price", value.price)
                                                                form.setValue("numberOfParticipation", value.numberOfParticipation)
                                                            } else field.onChange(undefined);

                                                        }}
                                                        placeholder={"Select parents..."}
                                                        emptyMessage={"No parent found"}
                                                    />
                                                    <Button type={"button"}
                                                            onClick={() => {
                                                                //handleParentEditClick()
                                                            }}>
                                                        Create
                                                    </Button>
                                                </div>
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
                                                            className="absolute inset-y-0 right-0 flex items-center pr-2">
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
                                        name="numberOfParticipation"
                                        render={({field}) => (
                                            <FormItem className="w-48">
                                                <FormLabel>Number Of Participation*</FormLabel>
                                                <FormControl>
                                                    <div className="relative w-20">
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
                                        name="expirationDate"
                                        render={({field}) => (
                                            <FormItem className="w-48">
                                                <FormLabel>Standard Validity Period*</FormLabel>
                                                <FormControl>
                                                    <CalendarInput {...field} shownYear={2010}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="issueDate"
                                        render={({field}) => (
                                            <FormItem className="w-48">
                                                <FormLabel>Standard Validity Period*</FormLabel>
                                                <FormControl>
                                                    <CalendarInput {...field} shownYear={2010}/>
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
