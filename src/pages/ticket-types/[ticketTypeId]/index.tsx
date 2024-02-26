import {InferGetServerSidePropsType} from "next";
import React, {useState} from "react";
import Link from "next/link";
import {Toaster} from "@/components/ui/toaster";
import {Label} from "@/components/ui/label";
import {fieldAppearance} from "@/components/fieldAppearance";
import {Pencil, Trash} from "lucide-react";
import {useRouter} from "next/router";
import TicketTypeForm from "@/form/ticket-type/TicketTypeForm";
import {serverSideClient} from "@/api/graphql/client";
import getTicketTypeById from "@/api/graphql/ticketType/getTicketTypeById";
import deletedTicketType from "@/api/graphql/ticketType/deletedTicketType";
import DeleteData from "@/components/deleteData";
import {TicketTypeData} from "@/model/ticket-type-data";
import {getSession, withPageAuthRequired} from "@auth0/nextjs-auth0";
import AccessTokenContext from "@/context/access-token-context";
import getAllRoles from "@/api/graphql/getAllRoles";


export const getServerSideProps = withPageAuthRequired<{
    selectedTicket: TicketTypeData,
    accessToken: string
}, {
    ticketTypeId: string
}>({
    async getServerSideProps(context) {
        let ticketData;
        if (context.params?.ticketTypeId) {
            try {
                const session = await getSession(context.req, context.res);
                let roles = await getAllRoles(session?.accessToken)
                let isAdmin = roles[0] === "ADMIN"
                if (isAdmin) {
                    ticketData = await getTicketTypeById(context.params.ticketTypeId, session?.accessToken, serverSideClient);
                    return {
                        props: {
                            selectedTicket: ticketData,
                            accessToken: session!.accessToken!
                        }
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
export default function Ticket({selectedTicket, accessToken}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [ticket, setTicket] = useState<TicketTypeData>(selectedTicket)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const router = useRouter()
    const onTicketUpdated = (newTicket: TicketTypeData) => {
        setTicket(newTicket)
    }
    const onTicketDeleted = () => {
        router.push("/ticket-types")
    }

    function handleEditClick() {
        setIsEditDialogOpen(true)
    }

    function handleDeleteClick() {
        setIsDeleteDialogOpen(true)
    }

    return (
        <AccessTokenContext.Provider value={accessToken}>
            <div className="container w-3/6 py-10 h-[100vh] overflow-auto">
                <div className="flex justify-between px-6 pb-6 items-center">
                    <Link href="/ticket-types">
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
                        <div className={`${fieldAppearance} mt-2`}>
                            {ticket.name}
                        </div>
                    </div>
                    <div className="mb-6">
                        <Label>Description:</Label>
                        <div className={`${fieldAppearance} mt-2 h-fit`}>
                            {ticket.description}
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center ">
                        <div className="mb-6 flex-1">
                            <Label>Price:</Label>
                            <div className={`${fieldAppearance} mt-2`}>
                                {ticket.price} HUF
                            </div>
                        </div>
                        <div className="mb-6 flex-1">
                            <Label>Number of participation:</Label>
                            <div className={`${fieldAppearance} mt-2`}>
                                {ticket.numberOfParticipation} pc(s)
                            </div>
                        </div>
                        <div className="mb-6 flex-1">
                            <Label>Standard validation period :</Label>
                            <div className={`${fieldAppearance} mt-2`}>
                                {ticket.standardValidityPeriod} day(s)
                            </div>
                        </div>
                    </div>
                </div>
                <Toaster/>
                <TicketTypeForm existingTicketType={ticket ?? undefined}
                                isOpen={isEditDialogOpen}
                                onTicketTypeModified={onTicketUpdated}
                                onOpenChange={setIsEditDialogOpen}
                />
                <DeleteData entityId={ticket.id}
                            entityLabel={`${ticket.name}`}
                            isOpen={isDeleteDialogOpen}
                            onOpenChange={setIsDeleteDialogOpen}
                            onSuccess={onTicketDeleted}
                            deleteFunction={deletedTicketType}
                            entityType="Ticket"
                />
            </div>
        </AccessTokenContext.Provider>
    )
}