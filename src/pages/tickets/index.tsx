import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import React, {useState} from "react";
import {Toaster} from "@/components/ui/toaster";
import {serverSideClient} from "@/api/graphql/client";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import getAllTickets from "@/api/graphql/ticket/getAllTickets";
import {Pencil, PlusSquare, Trash} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import DeleteData from "@/components/deleteData";
import {TicketData} from "@/model/ticket-data";
import TicketForm from "@/form/ticket/TicketForm";

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
    const onCTicketSaved = (savedTicket: TicketData) => {
        if (editedTicket) {
            const modifiedTickets = tickets.map((ticket) =>
                ticket.id === savedTicket.id ? savedTicket : ticket
            );
            setTickets(modifiedTickets)
        } else {
            setTickets(prevState => [...prevState, savedTicket])
        }
    }
    const onTicketDeleted = (ticket: TicketData) => {
        const updatedTickets = tickets.filter(p => p.id !== ticket.id);
        setTickets(updatedTickets);
    }
    const [editedTicket, setEditedTicket] = useState<TicketData | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [deletedTicket, setDeletedTicket] = useState<TicketData>()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    function handleEditClick(ticket: TicketData | null) {
        setIsEditDialogOpen(true)
        setEditedTicket(ticket)
    }

    function handleDeleteClick(ticket: TicketData) {
        setIsDeleteDialogOpen(true)
        setDeletedTicket(ticket)
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
                        <TableHead className="text-center">Name</TableHead>
                        <TableHead className="text-center">Description</TableHead>
                        <TableHead className="text-center">Price</TableHead>
                        <TableHead className="text-center">Number Of Participants</TableHead>
                        <TableHead className="text-center">Standard Validity Period</TableHead>
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
                                        {ticket.name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {ticket.description}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {ticket.price}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {ticket.numberOfParticipants}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {ticket.standardValidityPeriod}
                                    </TableCell>
                                    <TableCell className="p-1 text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger onClick={event => event.preventDefault()}>
                                                <span className="material-icons-outlined">more_horiz</span>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className={"min-w-8"}>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuItem
                                                    className={"justify-center hover:cursor-pointer"}
                                                    onClick={(event) => {
                                                        event.preventDefault()
                                                        event.stopPropagation()
                                                        handleEditClick(ticket)
                                                    }}>
                                                    <Pencil className={"mx-1"}/>
                                                    <span>Edit</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className={"justify-center hover:cursor-pointer p-2 mx-5 bg-red-600 text-white"}
                                                    onClick={event => {
                                                        event.preventDefault()
                                                        event.stopPropagation()
                                                        handleDeleteClick(ticket)
                                                    }}>
                                                    <Trash className={"mx-1"}/>
                                                    <span>Delete</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
                        onTicketModified={onCTicketSaved}
                        onOpenChange={setIsEditDialogOpen}
            />
            {/*<DeleteData data={deletedTicket}
                        isOpen={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                        onSuccess={onTicketDeleted}
                        deleteFunction={deleteTicket}
                        dataType={"Ticket"}
            />*/}
        </div>
    )
}