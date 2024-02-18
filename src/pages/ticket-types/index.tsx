import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import React, {useState} from "react";
import {Toaster} from "@/components/ui/toaster";
import {serverSideClient} from "@/api/graphql/client";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import getAllTicketTypes from "@/api/graphql/ticketType/getAllTicketTypes";
import {PlusSquare} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import DeleteData from "@/components/deleteData";
import {TicketTypeData} from "@/model/ticket-type-data";
import TicketTypeForm from "@/form/ticket-type/TicketTypeForm";
import deletedTicketType from "@/api/graphql/ticketType/deletedTicketType";
import SettingsDropdown from "@/components/SettingsDropdown";
import {getSession, withPageAuthRequired} from "@auth0/nextjs-auth0";
import AccessTokenContext from "@/context/AccessTokenContext";

export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(context) {
        const session = await getSession(context.req, context.res);
        const tickets = await getAllTicketTypes(session?.accessToken, serverSideClient)
        return {
            props: {
                ticketsData: tickets,
                accessToken: session!.accessToken!
            }
        };
    }
}) satisfies GetServerSideProps<{ ticketsData: TicketTypeData[] }>;

export default function Tickets({ticketsData, accessToken}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()
    const [ticketTypes, setTicketTypes] = useState<TicketTypeData[]>(ticketsData)
    const onTicketTypeSaved = (savedTicket: TicketTypeData) => {
        if (editedTicketType) {
            const modifiedTickets = ticketTypes.map((ticket) =>
                ticket.id === savedTicket.id ? savedTicket : ticket
            );
            setTicketTypes(modifiedTickets)
        } else {
            setTicketTypes(prevState => [...prevState, savedTicket])
        }
        setEditedTicketType(null)
    }
    const onTicketTypeDeleted = (ticket: TicketTypeData) => {
        const updatedTickets = ticketTypes.filter(p => p.id !== ticket.id);
        setTicketTypes(updatedTickets);
    }
    const [editedTicketType, setEditedTicketType] = useState<TicketTypeData | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [deletedTicket, setDeletedTicket] = useState<TicketTypeData>()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    function handleEditClick(ticket: TicketTypeData | null) {
        setIsEditDialogOpen(true)
        setEditedTicketType(ticket)
    }

    function handleDeleteClick(ticket: TicketTypeData) {
        setIsDeleteDialogOpen(true)
        setDeletedTicket(ticket)
    }

    return (
        <AccessTokenContext.Provider value={accessToken}>
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
                            <TableHead className="text-center w-2/12">Name</TableHead>
                            <TableHead className="text-center">Description</TableHead>
                            <TableHead className="text-center w-2/12">Price</TableHead>
                            <TableHead className="text-center w-1/12"># of participation</TableHead>
                            <TableHead className="text-center w-2/12">Valid for</TableHead>
                            <TableHead className="px-5"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            ticketTypes && ticketTypes.length !== 0 ? (
                                ticketTypes.map((ticketType) => (
                                    <TableRow key={ticketType.id} className="hover:bg-gray-300 hover:cursor-pointer"
                                              onClick={() => router.push(`ticket-types/${ticketType.id}`)}>
                                        <TableCell className="text-center">
                                            {ticketType.name}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {ticketType.description}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {ticketType.price} HUF
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {ticketType.numberOfParticipation} pc(s)
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {ticketType.standardValidityPeriod} day(s)
                                        </TableCell>
                                        <TableCell className="p-1 text-center">
                                            <SettingsDropdown
                                                handleEditClick={() => handleEditClick(ticketType)}
                                                handleDeleteClick={() => handleDeleteClick(ticketType)}
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
                <TicketTypeForm existingTicket={editedTicketType ?? undefined}
                                isOpen={isEditDialogOpen}
                                onTicketModified={onTicketTypeSaved}
                                onOpenChange={setIsEditDialogOpen}
                />
                <DeleteData entityId={deletedTicket?.id}
                            entityLabel={`${deletedTicket?.name}`}
                            isOpen={isDeleteDialogOpen}
                            onOpenChange={setIsDeleteDialogOpen}
                            onSuccess={onTicketTypeDeleted}
                            deleteFunction={deletedTicketType}
                            entityType="Ticket"
                />
            </div>
        </AccessTokenContext.Provider>
    )
}