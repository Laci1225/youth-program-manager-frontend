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
import deletedTicket from "@/api/graphql/ticket/deletedTicket";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import updateTicket from "@/api/graphql/ticket/updateTicket";
import fromTicketDataToTicketInputData from "@/model/fromTicketDataToTicketInputData";
import ConfirmDialog from "@/components/confirmDialog";
import {toast} from "@/components/ui/use-toast";
import {getSession} from "@auth0/nextjs-auth0";
import {useAuth} from "@/utils/auth";

export const getServerSideProps = (async (context) => {
    const session = await getSession(context.req, context.res);
    const tickets = await getAllTickets(session?.accessToken, serverSideClient)
    return {
        props: {
            ticketsData: tickets
        }
    };
}) satisfies GetServerSideProps<{ ticketsData: TicketData[] }>;

export function calculateDaysDifference(endDate: Date): number {
    return differenceInDays(new Date(endDate), new Date());
}

export default function Tickets({ticketsData}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const {accessToken} = useAuth()
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
            }), accessToken)
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
        <div className="container w-4/6 py-28">
            <div className="flex justify-between px-6 pb-6">
                <span>Tickets</span>
                <Button onClick={(event) => {
                    event.preventDefault()
                    handleEditClick(null)
                }}>
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
                        tickets && tickets.length !== 0 ? (
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
                                        <HoverText
                                            content={format(new Date(ticket.expirationDate), "P")}>
                                            {
                                                <div className="mt-2">
                                                    {calculateDaysDifference(ticket.expirationDate) > 5 ?
                                                        <div>
                                                            {
                                                                calculateDaysDifference(ticket.expirationDate)
                                                            } day(s)
                                                        </div>
                                                        :
                                                        calculateDaysDifference(ticket.expirationDate) > 0 ?
                                                            <div className="inline-flex text-yellow-600">
                                                                {
                                                                    calculateDaysDifference(ticket.expirationDate)
                                                                } day(s)
                                                                <AlertTriangle className="pl-1"/>
                                                            </div> :
                                                            <div
                                                                className="bg-red-700 text-white rounded mx-4 py-1">Expired
                                                            </div>
                                                    }
                                                </div>
                                            }</HoverText>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span
                                            className={`${
                                                (ticket.numberOfParticipation - (ticket.historyLog?.length || 0)) <= 1
                                                    ? (ticket.numberOfParticipation - (ticket.historyLog?.length || 0)) <= 0
                                                        ? "text-red-500"
                                                        : "text-yellow-500"
                                                    : ""
                                            }`}
                                        > {ticket.numberOfParticipation - (ticket.historyLog?.length || 0)} pc(s)
                                        </span>
                                    </TableCell>

                                    <TableCell className="p-1 text-center">
                                        <SettingsDropdown
                                            handleEditClick={() => handleEditClick(ticket)}
                                            handleDeleteClick={() => handleDeleteClick(ticket)}
                                            additionalItem={
                                                !!(ticket.historyLog && ticket.numberOfParticipation - ticket.historyLog.length <= 0) ?
                                                    <HoverText content="No more tickets avaiable">
                                                        <DropdownMenuItem
                                                            onClick={
                                                                (event) => {
                                                                    event.preventDefault()
                                                                    event.stopPropagation()
                                                                }}
                                                            className="justify-center hover:cursor-pointer p-2 mx-5 my-1
                                                            bg-gray-400 cursor-not-allowed">
                                                            Report participation
                                                        </DropdownMenuItem>
                                                    </HoverText>
                                                    : calculateDaysDifference(ticket.expirationDate) <= 0 ?
                                                        <HoverText content="Ticket expired">
                                                            <DropdownMenuItem
                                                                onClick={
                                                                    (event) => {
                                                                        event.preventDefault()
                                                                        event.stopPropagation()
                                                                    }}
                                                                className="justify-center p-2 mx-5 my-1
                                                                bg-gray-400 cursor-not-allowed">
                                                                Report participation
                                                            </DropdownMenuItem>
                                                        </HoverText> :
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