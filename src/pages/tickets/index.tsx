import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
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
import getAllTicketTypes from "@/api/graphql/ticketType/getAllTicketTypes";
import {Pencil, PlusSquare, Trash} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import DeleteData from "@/components/deleteData";
import {TicketTypeData} from "@/model/ticket-type-data";
import TicketTypeForm from "@/form/ticket-type/TicketTypeForm";
import deletedTicketType from "@/api/graphql/ticketType/deletedTicketType";
import SettingsDropdown from "@/components/SettingsDropdown";
import getAllTickets from "@/api/graphql/ticket/getAllTickets";
import {TicketData} from "@/model/ticket-data";
import {format} from "date-fns";
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
    const onTicketDeleted = (ticket: TicketTypeData) => {
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
                        <TableHead className="text-center">Child</TableHead>
                        <TableHead className="text-center">Ticket</TableHead>
                        <TableHead className="text-center">Issue Date</TableHead>
                        <TableHead className="text-center">Expiration Date</TableHead>
                        <TableHead className="text-center">Price</TableHead>
                        <TableHead className="text-center"># of participation</TableHead>
                        <TableHead className="px-5"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        tickets && tickets.length !== 0 ? (
                            tickets.map((ticket) => (
                                <TableRow key={ticket.id} className={"hover:bg-gray-300 hover:cursor-pointer"}
                                          onClick={() => router.push(`ticket-types/${ticket.id}`)}>
                                    <TableCell className="text-center">
                                        {ticket.id}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {ticket.ticketTypeId}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {ticket.price} €
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {ticket.numberOfParticipation} pc(s)
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {format(new Date(ticket.issueDate), "P")} day(s)
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {format(new Date(ticket.expirationDate), "P")} day(s)
                                    </TableCell>
                                    <TableCell className="p-1 text-center">
                                        <SettingsDropdown
                                            handleEditClick={handleEditClick}
                                            handleDeleteClick={handleDeleteClick}
                                            item={ticket}
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
            <DeleteData entityId={deletedTicket?.id}
                        entityLabel={`${deletedTicket?.id}`}
                        isOpen={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                        onSuccess={onTicketDeleted}
                        deleteFunction={deletedTicketType}
                        entityType={"Ticket"}
            />
        </div>
    )
}