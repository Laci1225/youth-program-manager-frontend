import {ChildData} from "@/model/child-data";
import {TicketTypeData} from "@/model/ticket-type-data";

export interface TicketData {
    id: string
    child: ChildData
    ticketType: TicketTypeData,
    issueDate: Date,
    expirationDate: Date
    price: number,
    numberOfParticipation: number
}

export interface TicketDataInput {
    childId: string
    ticketTypeId: string,
    issueDate: Date,
    expirationDate: Date
    price: number,
    numberOfParticipation: number
}