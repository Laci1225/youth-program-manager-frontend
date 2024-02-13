import {InferGetServerSidePropsType} from "next";
import React, {useState} from "react";
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
import updateTicket from "@/api/graphql/ticket/updateTicket";
import fromTicketDataToTicketInputData from "@/model/fromTicketDataToTicketInputData";
import {toast} from "@/components/ui/use-toast";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import HoverText from "@/components/hoverText";
import {calculateDaysDifference} from "@/pages/tickets";
import {getSession, withPageAuthRequired} from "@auth0/nextjs-auth0";
import {useAuth} from "@/utils/auth";


export const getServerSideProps = withPageAuthRequired<{ selectedTicket: TicketData }, {
    ticketId: string
}>({
    async getServerSideProps(context) {
        let ticketData;
        if (context.params?.ticketId) {
            try {
                const session = await getSession(context.req, context.res);
                ticketData = await getTicketById(context.params.ticketId, session?.accessToken, serverSideClient);
                return {
                    props: {
                        selectedTicket: ticketData
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
export default function Ticket({selectedTicket}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const {accessToken} = useAuth()
    const [ticket, setTicket] = useState<TicketData>(selectedTicket)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const router = useRouter()
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

    const [isReportParticipationClicked, setIsReportParticipationClicked] = useState<boolean>(false)
    const [isReportCancelParticipationClicked, setIsReportCancelParticipationClicked] = useState<boolean>(false)
    const [reportCancelParticipationIndex, setReportCancelParticipationIndex] = useState<number>()

    function reportParticipation() {
        setIsReportParticipationClicked(true)
    }

    function reportCancelParticipation(index: number) {
        setIsReportCancelParticipationClicked(true)
        setReportCancelParticipationIndex(index)
    }

    function handleCancelReport() {
        const {
            ticketType,
            child,
            id,
            ...remainingTicket
        } = ticket
        updateTicket(id, {
            ...remainingTicket,
            childId: child.id,
            ticketTypeId: ticketType.id,
            historyLog: (remainingTicket.historyLog?.filter((_, i) => i !== reportCancelParticipationIndex))
        }, accessToken).then(
            value =>
                setTicket(value)
        )
        setReportCancelParticipationIndex(undefined)
        toast({
            title: "Successfully deleted",
            duration: 2000
        });
    }

    function handleReport() {
        const updatedHistoryLog = [
            ...(ticket.historyLog || []),
            {date: new Date(), reporter: ""}
        ];
        setTicket(prevState => ({
            ...prevState,
            historyLog: updatedHistoryLog
        }));

        updateTicket(ticket.id, fromTicketDataToTicketInputData({
            ...ticket,
            historyLog: updatedHistoryLog
        }), accessToken)
            .then(value => {
                setTicket(value)
            }).then(() =>
            toast({
                variant: "default",
                title: `${ticket.child.givenName} ${ticket.child.familyName}'s ticket data reported successfully`,
                description: `${ticket.ticketType.name} reported`,
                duration: 2000
            })
        )

    }


    return (
        <div className="container w-3/6 py-10 h-[100vh] overflow-auto">
            <div className="flex justify-between px-6 pb-6 items-center">
                <Link href="/tickets">
                    <span className="material-icons-outlined">arrow_back</span>
                </Link>
                <div>
                    Ticket details
                </div>
                <div className="flex">
                    <div className=" flex flex-row items-center hover:cursor-pointer px-5"
                         onClick={(event) => {
                             event.preventDefault()
                             handleEditClick()
                         }}>
                        <Pencil className="mx-1"/>
                        <span>Edit</span>
                    </div>
                    <div
                        className="flex flex-row items-center hover:cursor-pointer rounded p-2 mx-5 bg-red-600 text-white"
                        onClick={(event) => {
                            event.preventDefault()
                            handleDeleteClick()
                        }}>
                        <Trash className="mx-1"/>
                        <span>Delete</span>
                    </div>
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
                        <div className={`${fieldAppearance} mt-2 ${ticket.historyLog &&
                        (ticket.numberOfParticipation - ticket.historyLog.length) <= 0 && "bg-red-700 text-white"}`}>
                            {ticket.historyLog ? ticket.numberOfParticipation - ticket.historyLog.length
                                : ticket.numberOfParticipation} pc(s)
                        </div>
                    </div>
                </div>
                <div className="mb-6 flex-1">
                    <Label>Valid for :</Label> {/*todo warning logic*/}
                    <div className={`${fieldAppearance}  
                    ${differenceInDays(new Date(ticket.expirationDate), new Date()) <= 5 && "bg-red-700 text-white"} mt-2`}>
                        {differenceInDays(new Date(ticket.expirationDate), new Date()) > 0 ? (
                                <>{
                                    differenceInDays(new Date(ticket.expirationDate), new Date())
                                } day(s)
                                </>) :
                            <>Expired</>
                        }
                    </div>
                </div>
                <div className="flex">
                    <div className="mb-6 flex-1">
                        <Label>Issue date :</Label>
                        <div className={`${fieldAppearance} mt-2`}>
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
                    {!!(ticket.historyLog && ticket.numberOfParticipation - ticket.historyLog.length <= 0) ?
                        <HoverText content="No more tickets avaiable">
                            <Button
                                className={`h-7 text-[10px] font-bold justify-center my-1 p-2 mx-5 bg-gray-400 cursor-not-allowed`}
                            >Report participation
                            </Button>
                        </HoverText>
                        : calculateDaysDifference(ticket.expirationDate) <= 0 ?
                            <HoverText content="Ticket expired">
                                <Button
                                    className={`h-7 text-[10px] font-bold justify-center my-1 p-2 mx-5 bg-gray-400 cursor-not-allowed`}>
                                    Report participation
                                </Button>
                            </HoverText> :
                            <Button
                                onClick={reportParticipation}
                                className="h-7 text-[10px] font-bold">
                                Report participation
                            </Button>
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
                                ticket.historyLog?.map((field, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell className="text-center">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {format(new Date(field.date), "P")}
                                        </TableCell>
                                        <TableCell className="w-6">
                                            <Button type="button" className="p-0"
                                                    variant="ghost"
                                                    onClick={() => reportCancelParticipation(index)}>
                                                <span className="material-icons-outlined">delete</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
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
                isOpen={isReportCancelParticipationClicked}
                onOpenChange={setIsReportCancelParticipationClicked}
                title="Are you absolutely sure?"
                description="This action can be undone."
                onContinue={handleCancelReport}
            />
        </div>
    )
}