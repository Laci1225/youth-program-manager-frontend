import {GetServerSideProps, InferGetServerSidePropsType} from "next";
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
import ShowTable from "@/form/ShowTable";
import {Button} from "@/components/ui/button";
import ConfirmDialog from "@/components/confirmDialog";
import updateTicket from "@/api/graphql/ticket/updateTicket";
import fromTicketDataToTicketInputData from "@/model/fromTicketDataToTicketInputData";
import {toast} from "@/components/ui/use-toast";


export const getServerSideProps = (async (context) => {
    let ticketData;
    if (context.params?.ticketId) {
        try {
            ticketData = await getTicketById(context.params.ticketId, serverSideClient);
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
}) satisfies GetServerSideProps<{ selectedTicket: TicketData }, { ticketId: string }>;
export default function Ticket({selectedTicket}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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

    function reportParticipation() {
        setIsReportParticipationClicked(true)
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

        updateTicket(ticket.id, fromTicketDataToTicketInputData({...ticket, historyLog: updatedHistoryLog}))
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
        <div className={"container w-3/6 py-10 h-[100vh] overflow-auto"}>
            <div className={"flex justify-between px-6 pb-6 items-center"}>
                <Link href={"/tickets"}>
                    <span className="material-icons-outlined">arrow_back</span>
                </Link>
                <div>
                    Ticket details
                </div>
                <div className={"flex"}>
                    <div className={" flex flex-row items-center hover:cursor-pointer px-5"}
                         onClick={(event) => {
                             event.preventDefault()
                             handleEditClick()
                         }}>
                        <Pencil className={"mx-1"}/>
                        <span>Edit</span>
                    </div>
                    <div
                        className={"flex flex-row items-center hover:cursor-pointer rounded p-2 mx-5 bg-red-600 text-white"}
                        onClick={(event) => {
                            event.preventDefault()
                            handleDeleteClick()
                        }}>
                        <Trash className={"mx-1"}/>
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
                <div className={"flex"}>
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
                <div className={"flex"}>
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
                    <Label className={"items-center"}>Report Participation:</Label>
                    <Button
                        onClick={() =>
                            !(ticket.historyLog && ticket.numberOfParticipation - ticket.historyLog.length <= 0
                                || differenceInDays(new Date(ticket.expirationDate), new Date()) <= 0)
                                ?
                                reportParticipation()
                                : alert("Cannot report attendance as participation limit reached or report attendance as ticket is expired")
                        }
                        className="h-7 text-[10px] font-bold">

                        Report participation
                    </Button>
                </div>
                <div className="mb-6 flex-1">
                    <ShowTable
                        tableFields={["#", "Date"]}
                        value={ticket.historyLog?.map((value, index) => ({
                            id: index + 1,
                            date: format(new Date(value.date), "P")
                        }))}
                        showDeleteButton={false}
                    />

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