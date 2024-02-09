import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import React, {useState} from "react";
import {Toaster} from "@/components/ui/toaster";
import {serverSideClient} from "@/api/graphql/client";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {AlertTriangle, Check, PlusSquare} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import DeleteData from "@/components/deleteData";
import SettingsDropdown from "@/components/SettingsDropdown";
import getAllTickets from "@/api/graphql/ticket/getAllTickets";
import {TicketData} from "@/model/ticket-data";
import {differenceInDays, format} from "date-fns";
import TicketForm from "@/form/ticket/TicketForm";
import HoverText from "@/components/hoverText";
import deleteTicket from "@/api/graphql/ticket/deleteTicket";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import ConfirmDialog from "@/components/confirmDialog";
import {toast} from "@/components/ui/use-toast";
import reportParticipation from "@/api/graphql/ticket/reportParticipation";
import {calculateDaysDifference} from "@/utils/calculateDaysDifference";
import {fieldAppearance} from "@/components/fieldAppearance";

export const getServerSideProps = (async () => {
    const tickets = await getAllTickets(serverSideClient)
    return {
        props: {
            ticketsData: tickets
        }
    };
}) satisfies GetServerSideProps<{ ticketsData: TicketData[] }>;

export default function Tickets({ticketsData}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();
    const [tickets, setTickets] = useState<TicketData[]>(ticketsData);
    const [editedTicket, setEditedTicket] = useState<TicketData | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [deletedTicketState, setDeletedTicketState] = useState<TicketData>();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isReportParticipationClicked, setIsReportParticipationClicked] = useState(false);
    const [reportedTicket, setReportedTicket] = useState<TicketData>();

    const handleEditClick = (ticket: TicketData | null) => {
        setIsEditDialogOpen(true);
        if (ticket) {
            setEditedTicket({...ticket, child: {...ticket.child, birthDate: new Date(ticket.child.birthDate)}});
        } else {
            setEditedTicket(null);
        }
    }

    const handleDeleteClick = (ticket: TicketData) => {
        setIsDeleteDialogOpen(true);
        setDeletedTicketState(ticket);
    };

    const handleReportClicked = (ticket: TicketData) => {
        setIsReportParticipationClicked(true);
        setReportedTicket(ticket);
    };

    const handleReport = () => {
        if (reportedTicket) {
            reportParticipation(reportedTicket.id, {date: new Date(), reporter: ""}).then((value) => {
                setTickets((prevTickets) =>
                    prevTickets.map((tic) => (value.id === tic.id ? value : tic))
                );
                toast({
                    variant: "default",
                    title: `${reportedTicket.child.givenName} ${reportedTicket.child.familyName}'s ticket data reported successfully`,
                    description: `${reportedTicket.ticketType.name} reported`,
                    duration: 2000,
                });
            });
        }
    };
    const onTicketSaved = (savedTicket: TicketData) => {
        if (editedTicket) {
            const modifiedTickets = tickets.map((ticket) =>
                ticket.id === savedTicket.id ? savedTicket : ticket
            );
            setTickets(modifiedTickets)
        } else {
            setTickets(prevState => [...prevState, savedTicket])
        }
        setEditedTicket(null)
    }
    const onTicketDeleted = (ticket: TicketData) => {
        const updatedTickets = tickets.filter(p => p.id !== ticket.id);
        setTickets(updatedTickets);
    }

    const renderReportParticipationButton = (ticket: TicketData) => {
        const hoverButton = <DropdownMenuItem
            onClick={
                (event) => {
                    event.preventDefault()
                    event.stopPropagation()
                }}
            className="justify-center p-2 mx-5 my-1 bg-gray-400 cursor-not-allowed">
            Report participation
        </DropdownMenuItem>

        if (ticket.numberOfParticipation - ticket.historyLog.length <= 0) {
            return (
                <HoverText content="No more tickets avaiable">
                    {hoverButton}
                </HoverText>
            )
        } else if (calculateDaysDifference(ticket.expirationDate) <= 0) {
            return (
                <HoverText content="Ticket expired">
                    {hoverButton}
                </HoverText>
            )
        } else if (calculateDaysDifference(new Date(), ticket.issueDate) <= 0) {
            return (
                <HoverText content="Ticket in not yet valid">
                    {hoverButton}
                </HoverText>
            )
        } else {
            return (
                <DropdownMenuItem
                    className="justify-center p-2 mx-5 my-1 bg-green-400"
                    onClick={
                        (event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            handleReportClicked(ticket)
                        }}>
                    <Check/> Report participation
                </DropdownMenuItem>
            );
        }
    };

    function handleValidFor(ticket: TicketData) {
        const dayDifference = calculateDaysDifference(ticket.expirationDate)
        return <HoverText
            content={format(new Date(ticket.expirationDate), "P")}>
            {
                <div className="mt-2">
                    {
                        dayDifference > 5 ?
                            <div>{dayDifference} day(s)</div> :
                            dayDifference > 0 ?
                                <div className="inline-flex text-yellow-600">
                                    {dayDifference} day(s)
                                    <AlertTriangle className="pl-1"/>
                                </div> :
                                <div className="bg-red-700 text-white rounded mx-4 py-1">
                                    Expired
                                </div>
                    }
                </div>
            }
        </HoverText>
    }

    return (
        <div className="container w-4/6 py-28">
            <div className="flex justify-between px-6 pb-6">
                <span>Tickets</span>
                <Button onClick={(event) => handleEditClick(null)}>
                    <PlusSquare/>
                    <span>Create</span>
                </Button>
            </div>
            <Table className="border border-gray-700 rounded">
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">Child</TableHead>
                        <TableHead className="text-center">Ticket type</TableHead>
                        <TableHead className="text-center">Valid until</TableHead>
                        <TableHead className="text-center">Participation</TableHead>
                        <TableHead className="px-5"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        !!tickets.length ? (
                            tickets.map((ticket) => (
                                <TableRow key={ticket.id} className="hover:bg-gray-300 hover:cursor-pointer"
                                          onClick={() => router.push(`tickets/${ticket.id}`)}>
                                    <TableCell className="text-center">
                                        {ticket.child.givenName} {ticket.child.familyName}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {ticket.ticketType.name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {handleValidFor(ticket)}

                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span
                                            className={`${
                                                (ticket.numberOfParticipation - (ticket.historyLog.length)) <= 1
                                                    ? (ticket.numberOfParticipation - (ticket.historyLog.length)) <= 0
                                                        ? "text-red-500"
                                                        : "text-yellow-500"
                                                    : ""
                                            }`}
                                        > {ticket.numberOfParticipation - (ticket.historyLog.length)} pc(s)
                                        </span>
                                    </TableCell>
                                    <TableCell className="p-1 text-center">
                                        <SettingsDropdown
                                            handleEditClick={() => handleEditClick(ticket)}
                                            handleDeleteClick={() => handleDeleteClick(ticket)}
                                            additionalItem={
                                                renderReportParticipationButton(ticket)
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            ))) : (
                            <TableRow>
                                <TableCell colSpan={6}>Nothing added</TableCell>
                            </TableRow>
                        )}
                </TableBody>
            </Table>
            <Toaster/>
            <TicketForm existingTicket={editedTicket ?? undefined}
                        isOpen={isEditDialogOpen}
                        onTicketModified={onTicketSaved}
                        onOpenChange={setIsEditDialogOpen}
            />
            <DeleteData entityId={deletedTicketState?.id}
                        entityLabel={`${deletedTicketState?.id}`}
                        isOpen={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                        onSuccess={onTicketDeleted}
                        deleteFunction={deleteTicket}
                        entityType="Ticket"
            />
            <ConfirmDialog
                isOpen={isReportParticipationClicked}
                onOpenChange={setIsReportParticipationClicked}
                title="Are you absolutely sure?"
                description="This action can be undone."
                onContinue={handleReport}
            />
        </div>
    )
}