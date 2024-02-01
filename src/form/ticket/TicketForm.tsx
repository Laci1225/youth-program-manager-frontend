import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/components/ui/use-toast";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import LoadingButton from "@/components/loading-button";
import {ticketSchema} from "@/form/ticket/ticketSchema";
import CalendarInput from "@/form/CalendarInput";
import {Button} from "@/components/ui/button";
import getPotentialChildren from "@/api/graphql/parent/getPotentialChildren";
import {TicketData} from "@/model/ticket-data";
import updateTicket from "@/api/graphql/ticket/updateTicket";
import addTicket from "@/api/graphql/ticket/addTicket";
import getPotentialTicketTypes from "@/api/graphql/ticket/getPotentialTicketTyoes";
import {addDays, differenceInDays} from "date-fns";
import ChildForm from "@/form/child/ChildForm";
import {ChildData} from "@/model/child-data";
import {TicketTypeData} from "@/model/ticket-type-data";
import TicketTypeForm from "@/form/ticket-type/TicketTypeForm";
import {AutoComplete} from "@/form/AutoComplete";
import {Info, ToggleLeft, ToggleRight} from "lucide-react";
import HoverText from "@/components/hoverText";


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
            childId: existingTicket?.child.id,
            ticketTypeId: existingTicket?.ticketType.id,
            price: existingTicket?.price,
            numberOfParticipation: existingTicket?.numberOfParticipation,
            issueDate: existingTicket?.issueDate ? new Date(existingTicket.issueDate) : undefined,
            expirationDate: existingTicket?.expirationDate ? new Date(existingTicket.expirationDate) : undefined,
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

    const [days, setDays] = useState<number | undefined>(undefined)

    useEffect(() => {
        form.reset({
            childId: existingTicket?.child.id,
            ticketTypeId: existingTicket?.ticketType.id,
            price: existingTicket?.price,
            numberOfParticipation: existingTicket?.numberOfParticipation,
            issueDate: existingTicket?.issueDate ? new Date(existingTicket.issueDate) : undefined,
            expirationDate: existingTicket?.expirationDate ? new Date(existingTicket.expirationDate) : undefined,
        })
        calcDateByGivenDate()
    }, [existingTicket])

    const calcDateByGivenDay = (givenDay?: number) => {
        if (givenDay) {
            const issueDate = form.getValues("issueDate");
            const result = addDays(issueDate, givenDay)
            form.setValue("expirationDate", result);
            setDays(givenDay)
        } else {
            const issueDate = form.getValues("issueDate");
            const result = addDays(issueDate, days ?? 0)
            form.setValue("expirationDate", result);
        }
    }
    const [disable, setDisable] = useState<boolean>()


    function calcDateByGivenDate() {
        const issueDate = form.getValues("issueDate");
        const expirationDate = form.getValues("expirationDate");
        if (issueDate && expirationDate) {
            setDays(differenceInDays(expirationDate, new Date()));
        }
    }

    const [isChildEditDialogOpen, setIsChildEditDialogOpen] = useState(false)

    function handleChildEditClick() {
        setIsChildEditDialogOpen(true)
    }

    const [childAutocompleteValue, setChildAutocompleteValue] = useState<ChildData>()

    function onChildUpdated(child: ChildData) {
        form.setValue("childId", child.id)
        setChildAutocompleteValue(child)
    }

    const [isTicketTypeEditDialogOpen, setIsTicketTypeEditDialogOpen] = useState(false)

    function handleTicketTypeEditClick() {
        setIsTicketTypeEditDialogOpen(true)
    }

    const [ticketTypeAutocompleteValue, setTicketTypeAutocompleteValue] = useState<TicketTypeData>()

    function onTicketTypeUpdated(ticketType: TicketTypeData) {
        form.setValue("ticketTypeId", ticketType.id)
        form.setValue("price", ticketType.price)
        form.setValue("numberOfParticipation", ticketType.numberOfParticipation)
        setDays(ticketType.standardValidityPeriod)
        setTicketTypeAutocompleteValue(ticketType)
    }

    return (
        <>

            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent
                    className={`sm:max-w-[700px] ${form.getValues("ticketTypeId") ? "h-[90vh]" : "h-[50vh]"} shadow-muted-foreground`}>
                    <DialogHeader>
                        <DialogTitle>{existingTicket ? "Update" : "Create"} a ticket</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}
                              className="flex justify-center flex-col space-y-4 mx-4">
                            <div className="mx-4">
                                <FormField
                                    control={form.control}
                                    name="childId"
                                    render={({field}) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Child Name*</FormLabel>
                                            <FormControl>
                                                <div className="flex justify-between">
                                                    <AutoComplete
                                                        className="w-2/3"
                                                        key={0}
                                                        value={childAutocompleteValue ? childAutocompleteValue : existingTicket?.child}
                                                        isLoading={false}
                                                        disabled={!!existingTicket}
                                                        getPotential={getPotentialChildren}
                                                        isAdded={false}
                                                        onValueChange={(value) => {
                                                            if (value) {
                                                                field.onChange(value.id);
                                                            } else field.onChange(undefined);

                                                        }}
                                                        placeholder="Select children..."
                                                        emptyMessage="No child found"
                                                    />
                                                    {!existingTicket &&
                                                        <Button type="button"
                                                                onClick={() => {
                                                                    handleChildEditClick()
                                                                }}>
                                                            Create
                                                        </Button>
                                                    }
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
                                            <FormLabel>Ticket type*</FormLabel>
                                            <FormControl>
                                                <div className="flex justify-between">
                                                    <AutoComplete
                                                        className="w-2/3"
                                                        key={0}
                                                        value={ticketTypeAutocompleteValue ? ticketTypeAutocompleteValue : existingTicket?.ticketType}
                                                        isLoading={false}
                                                        disabled={!!existingTicket}
                                                        getPotential={getPotentialTicketTypes}
                                                        isAdded={false}
                                                        onValueChange={(value) => {
                                                            if (value) {
                                                                field.onChange(value.id);
                                                                form.setValue("price", value.price)
                                                                form.setValue("numberOfParticipation", value.numberOfParticipation)
                                                                form.setValue("issueDate", new Date())
                                                                setDays(value.standardValidityPeriod)
                                                                calcDateByGivenDay(value.standardValidityPeriod)
                                                            } else field.onChange(undefined);

                                                        }}
                                                        placeholder="Select ticket type..."
                                                        emptyMessage="No ticket type found"
                                                    />
                                                    <Button type="button"
                                                            onClick={() => {
                                                                handleTicketTypeEditClick()
                                                            }}>
                                                        Create
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                {form.getValues("ticketTypeId") && (
                                    <>
                                        <div className="flex w-full">
                                            <FormField
                                                control={form.control}
                                                name="price"
                                                render={({field}) => (
                                                    <FormItem className="w-1/3">
                                                        <FormLabel>Price*</FormLabel>
                                                        <FormControl>
                                                            <div className="relative w-full">
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
                                                    <FormItem className="w-1/3">
                                                        <FormLabel>Number Of Participation*</FormLabel>
                                                        <FormControl>
                                                            <div className="relative w-full">
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
                                                name="issueDate"
                                                render={({field}) => (
                                                    <FormItem className="w-1/3">
                                                        <FormLabel>Valid from*</FormLabel>
                                                        <FormControl>
                                                            <CalendarInput {...field}
                                                                           shownYear={new Date().getFullYear()}
                                                                           reCalc={calcDateByGivenDay}
                                                                           canBeFuture={true}/>
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <FormField
                                                control={form.control}
                                                name="expirationDate"
                                                render={({field}) => (
                                                    <FormItem className="w-full">
                                                        <div className="flex">
                                                            <FormLabel>Valid until*</FormLabel>
                                                            <HoverText
                                                                content={`Edit ${disable ? " days " : " date "} instead `}>

                                                                <div className="flex ml-4 text-xs cursor-pointer"
                                                                     onClick={
                                                                         () => setDisable(!disable)}>{disable ?
                                                                    <ToggleLeft/> :
                                                                    <ToggleRight/>}
                                                                    <Info className="h-4"/>
                                                                </div>
                                                            </HoverText>
                                                        </div>
                                                        <FormControl>
                                                            <div className="flex">
                                                                <div className="w-1/3 px-2">
                                                                    <CalendarInput {...field}
                                                                                   shownYear={new Date().getFullYear()}
                                                                                   reCalc={calcDateByGivenDate}
                                                                                   disabled={!disable}
                                                                                   canBeFuture={true}
                                                                                   minDate={form.getValues("issueDate")}
                                                                    />
                                                                </div>
                                                                <div className="relative w-1/3 px-2">
                                                                    <Input
                                                                        disabled={disable}
                                                                        onClick={() => setDisable(false)}
                                                                        onInput={(event) => {
                                                                            if (!!Number(event.currentTarget.value))
                                                                                calcDateByGivenDay(Number(event.currentTarget.value));
                                                                            else setDays(undefined)
                                                                        }}
                                                                        value={days}
                                                                        className="pr-10"
                                                                    />
                                                                    <span
                                                                        className="absolute mr-2 inset-y-0 right-0 flex items-center pr-2">
                                                                        day(s)
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            <DialogFooter>
                                <LoadingButton isLoading={isSubmitting}>
                                    {existingTicket ? "Update" : "Create"}
                                </LoadingButton>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            <ChildForm
                isOpen={isChildEditDialogOpen}
                onOpenChange={setIsChildEditDialogOpen}
                onChildModified={onChildUpdated}
                onParentFormClicked={true}
            />
            <TicketTypeForm
                onTicketModified={onTicketTypeUpdated}
                isOpen={isTicketTypeEditDialogOpen}
                onOpenChange={setIsTicketTypeEditDialogOpen}
            />
        </>
    );
}

export default TicketForm;
