import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import React, {useState} from "react";
import {Toaster} from "@/components/ui/toaster";
import {serverSideClient} from "@/api/graphql/client";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {Check, PlusSquare} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import DeleteData from "@/components/deleteData";
import SettingsDropdown from "@/components/SettingsDropdown";
import getAllTickets from "@/api/graphql/ticket/getAllTickets";
import {TicketData} from "@/model/ticket-data";
import {differenceInDays, format} from "date-fns";
import TicketForm from "@/form/ticket/TicketForm";
import HoverText from "@/components/hoverText";
import deletedTicket from "@/api/graphql/ticket/deletedTicket";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import updateTicket from "@/api/graphql/ticket/updateTicket";
import fromTicketDataToTicketInputData from "@/model/fromTicketDataToTicketInputData";
import ConfirmDialog from "@/components/confirmDialog";
import {toast} from "@/components/ui/use-toast";

export const getServerSideProps = (async () => {
    const tickets = await getAllTickets(serverSideClient)
    return {
        props: {
            ticketsData: tickets
        }
    };
}) satisfies GetServerSideProps<{ ticketsData: TicketData[] }>;

export default function Tickets({ticketsData}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()
    const [tickets, setTickets] = useState<TicketData[]>(ticketsData)
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
    const [editedTicket, setEditedTicket] = useState<TicketData | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [deletedTicketState, setDeletedTicketState] = useState<TicketData>()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    function handleEditClick(ticket: TicketData | null) {
        setIsEditDialogOpen(true)
        setEditedTicket(ticket)
    }

    function handleDeleteClick(ticket: TicketData) {
        setIsDeleteDialogOpen(true)
        setDeletedTicketState(ticket)
    }

    const [isReportParticipationClicked, setIsReportParticipationClicked] = useState<boolean>(false)

    const [reportedTicket, setReportedTicket] = useState<TicketData>()

    function handleReport() {
        if (reportedTicket) {
            const updatedHistoryLog = [
                ...(reportedTicket.historyLog || []),
                {date: new Date(), reporter: ""}
            ];
            setTickets(prevTickets => {
                return prevTickets.map(tic => {
                    if (reportedTicket.id === tic.id) {
                        return {
                            ...tic,
                            historyLog: updatedHistoryLog
                        };
                    } else {
                        return tic;
                    }
                });
            });
            updateTicket(reportedTicket.id, fromTicketDataToTicketInputData({
                ...reportedTicket,
                historyLog: updatedHistoryLog
            }))
                .then(value => {
                    setTickets(prevTickets => {
                        return prevTickets.map(tic => {
                            if (value.id === tic.id) {
                                return {
                                    ...tic,
                                    historyLog: updatedHistoryLog
                                };
                            } else {
                                return tic;
                            }
                        });
                    });
                })
                .then(() =>
                    toast({
                        variant: "default",
                        title: `${reportedTicket.child.givenName} ${reportedTicket.child.familyName}'s ticket data reported successfully`,
                        description: `${reportedTicket.ticketType.name} reported`,
                        duration: 2000
                    })
                )
        }
    }

    function handleReportClicked(ticket: TicketData) {
        setIsReportParticipationClicked(true)
        setReportedTicket(ticket)
    }

    return (
        <div className={"container w-4/6 py-28"}>
            <div className={"flex justify-between px-6 pb-6"}>
                <span>Tickets</span>
                <Button onClick={(event) => {
                    event.preventDefault()
                    handleEditClick(null)
                }}>
                    <PlusSquare/>
                    <span>Create</span>
                </Button>
            </div>
            <Table className={"border border-gray-700 rounded"}>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">Child</TableHead>
                        <TableHead className="text-center">Ticket</TableHead>
                        <TableHead className="text-center">Valid until</TableHead>
                        <TableHead className="text-center">Participation</TableHead>
                        <TableHead className="px-5"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        tickets && tickets.length !== 0 ? (
                            tickets.map((ticket) => (
                                <TableRow key={ticket.id} className={"hover:bg-gray-300 hover:cursor-pointer"}
                                          onClick={() => router.push(`tickets/${ticket.id}`)}>
                                    <TableCell className="text-center">
                                        {ticket.child.givenName} {ticket.child.familyName}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {ticket.ticketType.name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <HoverText trigger={
                                            <div
                                                className={`${differenceInDays(new Date(ticket.expirationDate), new Date()) <= 5 && "bg-red-700 text-white"} mt-2`}>
                                                {differenceInDays(new Date(ticket.expirationDate), new Date()) > 0 ? (
                                                        <>{
                                                            differenceInDays(new Date(ticket.expirationDate), new Date())}
                                                            <span> day(s)</span>
                                                        </>) :
                                                    <>Expired</>
                                                }
                                            </div>
                                        }
                                                   content={format(new Date(ticket.expirationDate), "P")}/>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {ticket.historyLog ? ticket.numberOfParticipation - ticket.historyLog.length
                                            : ticket.numberOfParticipation} pc(s)
                                    </TableCell>
                                    <TableCell className="p-1 text-center">
                                        <SettingsDropdown
                                            handleEditClick={handleEditClick}
                                            handleDeleteClick={handleDeleteClick}
                                            item={ticket}
                                            additionalItem={
                                                //todo hover text why is it disabled
                                                <DropdownMenuItem
                                                    className={"justify-center hover:cursor-pointer p-2 mx-5 bg-green-600 text-white"}
                                                    onClick={event => {
                                                        event.preventDefault()
                                                        event.stopPropagation()
                                                        !(ticket.historyLog && ticket.numberOfParticipation - ticket.historyLog.length <= 0
                                                            || differenceInDays(new Date(ticket.expirationDate), new Date()) <= 0)
                                                            ?
                                                            handleReportClicked(ticket)
                                                            : alert("Cannot report attendance as participation limit reached or report attendance as ticket is expired")
                                                    }}>
                                                    <Check className={"mx-1"}/>
                                                    <span>Report attendance</span>
                                                </DropdownMenuItem>
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
                        deleteFunction={deletedTicket}
                        entityType={"Ticket"}
            />
            <ConfirmDialog
                isOpen={isReportParticipationClicked}
                onOpenChange={setIsReportParticipationClicked}
                title={"Are you absolutely sure?"}
                description={"This action cannot be undone. This will permanently delete your" +
                    " account and remove your data from our servers."}
                onContinue={handleReport}
            />
        </div>
    )
}