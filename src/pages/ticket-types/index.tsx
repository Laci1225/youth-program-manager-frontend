import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import React, {useContext, useEffect, useState} from "react";
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
import AccessTokenContext from "@/context/access-token-context";
import jwt from "jsonwebtoken";
import PermissionContext from "@/context/permission-context";
import {
    CREATE_TICKET_TYPES,
    DELETE_TICKET_TYPES,
    LIST_TICKET_TYPES,
    UPDATE_TICKET_TYPES
} from "@/constants/auth0-permissions";
import getPermissions from "@/utils/getPermissions";
import {cn} from "@/lib/utils";

export const getServerSideProps = withPageAuthRequired<{
    ticketsData: TicketTypeData[],
    accessToken: string,
    permissions: string[]
}>({
    async getServerSideProps(context) {
        const session = await getSession(context.req, context.res);
        const permissions = await getPermissions(session);
        if (permissions.includes(LIST_TICKET_TYPES)) {
            const tickets = await getAllTicketTypes(session?.accessToken, serverSideClient)
            return {
                props: {
                    ticketsData: tickets,
                    accessToken: session!.accessToken!,
                    permissions: permissions
                }
            }
        } else {
            return {
                notFound: true
            }
        }

    }
})

export default function Tickets({
                                    ticketsData,
                                    accessToken,
                                    permissions
                                }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const {setPermissions} = useContext(PermissionContext)
    useEffect(() => {
        setPermissions(permissions)
    }, [permissions, setPermissions]);
    const router = useRouter()
    const [ticketTypes, setTicketTypes] = useState<TicketTypeData[]>(ticketsData)
    const onTicketTypeSaved = (savedTicketType: TicketTypeData) => {
        if (editedTicketType) {
            const modifiedTickets = ticketTypes.map((ticket) =>
                ticket.id === savedTicketType.id ? savedTicketType : ticket
            );
            setTicketTypes(modifiedTickets)
        } else {
            setTicketTypes(prevState => [...prevState, savedTicketType])
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
                    <span className="text-2xl font-bold text-gray-800">Ticket types List</span>
                    {
                        permissions.includes(CREATE_TICKET_TYPES) && (
                            <Button onClick={(event) => {
                                event.preventDefault()
                                handleEditClick(null)
                            }}>
                                <PlusSquare size={20} className="mr-1"/>
                                <span>Create</span>
                            </Button>
                        )
                    }
                </div>
                <Table>
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
                            !!ticketTypes ? (
                                ticketTypes.map((ticketType, index) => (
                                    <TableRow key={ticketType.id}
                                              className={cn(`hover:bg-blue-100 hover:cursor-pointer transition-all`, index % 2 === 0 ? 'bg-gray-100' : 'bg-white')}
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
                                            {
                                                <SettingsDropdown
                                                    handleEditClick={() => handleEditClick(ticketType)}
                                                    handleDeleteClick={() => handleDeleteClick(ticketType)}
                                                    editPermission={UPDATE_TICKET_TYPES}
                                                    deletePermission={DELETE_TICKET_TYPES}
                                                />
                                            }
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
                <TicketTypeForm existingTicketType={editedTicketType ?? undefined}
                                isOpen={isEditDialogOpen}
                                onTicketTypeModified={onTicketTypeSaved}
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