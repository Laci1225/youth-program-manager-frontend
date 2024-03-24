import {InferGetServerSidePropsType} from "next";
import React, {useContext, useEffect, useState} from "react";
import Link from "next/link";
import {Toaster} from "@/components/ui/toaster";
import {Label} from "@/components/ui/label";
import {fieldAppearance} from "@/components/fieldAppearance";
import {Pencil, Trash} from "lucide-react";
import {useRouter} from "next/router";
import {serverSideClient} from "@/api/graphql/client";
import deletedTicketType from "@/api/graphql/ticketType/deletedTicketType";
import DeleteData from "@/components/deleteData";
import getTicketById from "@/api/graphql/ticket/getTicketById";
import {TicketData} from "@/model/ticket-data";
import {differenceInDays, format} from "date-fns";
import TicketForm from "@/form/ticket/TicketForm";
import {Button} from "@/components/ui/button";
import ConfirmDialog from "@/components/confirmDialog";
import {toast} from "@/components/ui/use-toast";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import HoverText from "@/components/hoverText";
import reportParticipation from "@/api/graphql/ticket/reportParticipation";
import removeParticipation from "@/api/graphql/ticket/removeParticipation";
import {calculateDaysDifference} from "@/utils/calculateDaysDifference";
import {cn} from "@/lib/utils";
import {getSession, withPageAuthRequired} from "@auth0/nextjs-auth0";
import AccessTokenContext from "@/context/access-token-context";
import jwt from "jsonwebtoken";
import PermissionContext from "@/context/permission-context";
import {
    CREATE_TICKET_PARTICIPATIONS, DELETE_TICKET_PARTICIPATIONS,
    DELETE_TICKETS, READ_TICKET_PARTICIPATIONS,
    READ_TICKETS,
    UPDATE_TICKETS
} from "@/constants/auth0-permissions";
import getPermissions from "@/utils/getPermissions";


export const getServerSideProps = withPageAuthRequired<{
    selectedTicket: TicketData,
    accessToken: string,
    permissions: string[]
}, {
    ticketId: string
}>({
    async getServerSideProps(context) {
        if (context.params?.ticketId) {
            try {
                const session = await getSession(context.req, context.res);
                const permissions = await getPermissions(session);
                if (permissions.includes(READ_TICKETS)) {
                    const ticketData = await getTicketById(context.params.ticketId, session?.accessToken, serverSideClient);
                    return {
                        props: {
                            selectedTicket: ticketData,
                            accessToken: session!.accessToken!,
                            permissions: permissions
                        }
                    }
                } else {
                    return {
                        notFound: true
                    }
                }
            } catch (error) {
                return {
                    notFound: true
                };
            }
        }
        return {
            notFound: true
        };
    }
})
export default function Ticket({
                                   selectedTicket,
                                   accessToken,
                                   permissions
                               }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const {setPermissions} = useContext(PermissionContext)
    useEffect(() => {
        setPermissions(permissions)
    }, [permissions, setPermissions]);
    const router = useRouter()
    const [ticket, setTicket] = useState<TicketData>(selectedTicket)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isReportParticipationClicked, setIsReportParticipationClicked] = useState<boolean>(false)
    const [isRemoveParticipationClicked, setIsRemoveParticipationClicked] = useState<boolean>(false)
    const [removeParticipationIndex, setRemoveParticipationIndex] = useState<number>()
    const onTicketUpdated = (newTicket: TicketData) => {
        setTicket(newTicket)
    }
    const onTicketDeleted = () => {
        router.push("/tickets")
    }

    function handleEditClick() {
        setIsEditDialogOpen(true)
    }

    function handleDeleteClick() {
        setIsDeleteDialogOpen(true)
    }

    function handleReportParticipation() {
        setIsReportParticipationClicked(true)
    }

    function handleRemoveParticipation(index: number) {
        setIsRemoveParticipationClicked(true)
        setRemoveParticipationIndex(index)
    }

    function handleRemoveReport() {
        const {
            ticketType,
            child,
            id,
            ...remainingTicket
        } = ticket
        const participationToRemove = remainingTicket.historyLog.find((_, i) => i === removeParticipationIndex);
        if (participationToRemove) {
            removeParticipation(id, participationToRemove, accessToken)
                .then(value => {
                    setTicket(value)
                    toast({
                        title: "Successfully deleted",
                        duration: 2000
                    });
                });
        }
        setRemoveParticipationIndex(undefined)
    }

    function handleReport() {
        reportParticipation(ticket.id, {date: new Date(), reporter: ""}, accessToken
        )
            .then(value => {
                setTicket(value)
            }).then(() =>
            toast({
                variant: "default",
                title: `${ticket.child.givenName} ${ticket.child.familyName}'s participation reported successfully`,
                description: `${ticket.ticketType.name} reported`,
                duration: 2000
            })
        )

    }

    function handleValidFor() {
        const dayDifference = differenceInDays(new Date(ticket.expirationDate), new Date())
        return (
            <div className={`${fieldAppearance}  
                    ${dayDifference <= 5 && "bg-red-700 text-white"} mt-2`}>
                {dayDifference > 0 ? (
                        <>{
                            dayDifference
                        } day(s)
                        </>) :
                    <>Expired</>
                }
            </div>)
    }

    const renderReportParticipationButton = (ticket: TicketData, handleReportParticipation: () => void) => {
        const hoverButton = <Button
            className="h-7 text-[10px] font-bold justify-center my-1 p-2 mx-5 bg-gray-400 cursor-not-allowed">
            Report participation
        </Button>
        if (ticket.numberOfParticipation - ticket.historyLog.length <= 0) {
            return (
                <HoverText content="No more tickets available">
                    {hoverButton}
                </HoverText>
            );
        } else if (calculateDaysDifference(ticket.expirationDate) <= 0) {
            return (
                <HoverText content="Ticket expired">
                    {hoverButton}
                </HoverText>
            );
        } else if (calculateDaysDifference(new Date(), ticket.issueDate) <= 0) {
            return (
                <HoverText content="Ticket is not yet valid">
                    {hoverButton}
                </HoverText>
            );
        } else {
            return (
                <Button onClick={handleReportParticipation} className="h-7 text-[10px] font-bold">
                    Report participation
                </Button>
            );
        }
    };

    return (
        <AccessTokenContext.Provider value={accessToken}>
            <div className="container w-3/6 py-10 h-[85vh] overflow-auto">
                <div className="flex justify-between px-6 pb-6 items-center">
                    <Link href="/tickets">
                        <span className="material-icons-outlined">arrow_back</span>
                    </Link>
                    <div>
                        Ticket details
                    </div>
                    <div className="flex">
                        {
                            permissions.includes(UPDATE_TICKETS) && (
                                <div className="flex flex-row items-center hover:cursor-pointer px-5"
                                     onClick={(event) => {
                                         event.preventDefault()
                                         handleEditClick()
                                     }}>
                                    <Pencil className="mx-1"/>
                                    <span>Edit</span>
                                </div>)
                        }
                        {
                            permissions.includes(DELETE_TICKETS) && (
                                <div
                                    className="flex flex-row items-center hover:cursor-pointer rounded p-2 mx-5 bg-red-600 text-white"
                                    onClick={(event) => {
                                        event.preventDefault()
                                        handleDeleteClick()
                                    }}>
                                    <Trash className="mx-1"/>
                                    <span>Delete</span>
                                </div>)
                        }
                    </div>
                </div>
                <div className="border border-gray-200 rounded p-4">
                    <div className="mb-6">
                        <Label>Full Name:</Label>
                        <div className={`${fieldAppearance} mt-2 cursor-pointer`}
                             onClick={() => router.push(`/children/${ticket.child.id}`, `/children/${ticket.child.id}`)}>
                            {ticket.child.givenName} {ticket.child.familyName}
                        </div>
                    </div>
                    <div className="mb-6">
                        <Label>Ticket name:</Label>
                        <div className={`${fieldAppearance} mt-2 cursor-pointer`}
                             onClick={() => router.push(`/ticket-types/${ticket.ticketType.id}`, `/ticket-types/${ticket.ticketType.id}`)}>
                            {ticket.ticketType.name}
                        </div>
                    </div>
                    <div className="flex">
                        <div className="mb-6 flex-1">
                            <Label>Price:</Label>
                            <div className={`${fieldAppearance} mt-2`}>
                                {ticket.price} HUF
                            </div>
                        </div>
                        <div className="mb-6 flex-1">
                            <Label>Number of participation:</Label>
                            <div
                                className={cn(`${fieldAppearance} mt-2`, ticket.numberOfParticipation - ticket.historyLog.length <= 0 && "bg-red-700 text-white")}>
                                {ticket.numberOfParticipation - ticket.historyLog.length} pc(s)
                            </div>
                        </div>
                    </div>
                    <div className="mb-6 flex-1">
                        <Label>Valid for :</Label>
                        {handleValidFor()}
                    </div>
                    <div className="flex">
                        <div className="mb-6 flex-1">
                            <Label>Issue date :</Label>
                            <div
                                className={cn(`${fieldAppearance} mt-2`, calculateDaysDifference(new Date(), ticket.issueDate) <= 0 && "bg-orange-300")}>
                                {format(new Date(ticket.issueDate), "P")}
                            </div>
                        </div>
                        <div className="mb-6 flex-1">
                            <Label>Expiration date :</Label>
                            <div className={`${fieldAppearance} mt-2`}>
                                {format(new Date(ticket.expirationDate), "P")}
                            </div>
                        </div>
                    </div>
                    <div className="mb-6 flex justify-between">
                        <Label className="items-center">Report Participation:</Label>
                        {
                            permissions.includes(CREATE_TICKET_PARTICIPATIONS) && (
                                <>
                                    {renderReportParticipationButton(ticket, handleReportParticipation)}
                                </>)
                        }
                    </div>
                    <div className="mb-6 flex-1">
                        <Table className="w-full border border-gray-200">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">#</TableHead>
                                    <TableHead className="text-center">Date</TableHead>
                                    <TableHead className="w-5"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    permissions.includes(READ_TICKET_PARTICIPATIONS) && (
                                        ticket.historyLog.map((field, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell className="text-center">{index + 1}</TableCell>
                                                <TableCell
                                                    className="text-center">{format(new Date(field.date), "P")}</TableCell>
                                                {
                                                    permissions.includes(DELETE_TICKET_PARTICIPATIONS) && (
                                                        <TableCell className="w-6">
                                                            <Button type="button" className="p-0"
                                                                    variant="ghost"
                                                                    onClick={() => handleRemoveParticipation(index)}>
                                                                <span className="material-icons-outlined">delete</span>
                                                            </Button>
                                                        </TableCell>)
                                                }
                                            </TableRow>
                                        )))
                                }
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <Toaster/>
                <TicketForm existingTicket={ticket ?? undefined}
                            isOpen={isEditDialogOpen}
                            onTicketModified={onTicketUpdated}
                            onOpenChange={setIsEditDialogOpen}
                />
                <DeleteData entityId={ticket.id}
                            entityLabel={`${ticket.ticketType.name}`}
                            isOpen={isDeleteDialogOpen}
                            onOpenChange={setIsDeleteDialogOpen}
                            onSuccess={onTicketDeleted}
                            deleteFunction={deletedTicketType}
                            entityType="Ticket"
                />
                <ConfirmDialog
                    isOpen={isReportParticipationClicked}
                    onOpenChange={setIsReportParticipationClicked}
                    title="Are you absolutely sure?"
                    description="This action can be undone."
                    onContinue={handleReport}
                />
                <ConfirmDialog
                    isOpen={isRemoveParticipationClicked}
                    onOpenChange={setIsRemoveParticipationClicked}
                    title="Are you absolutely sure?"
                    description="This action can be undone."
                    onContinue={handleRemoveReport}
                />
            </div>
        </AccessTokenContext.Provider>

    )
}