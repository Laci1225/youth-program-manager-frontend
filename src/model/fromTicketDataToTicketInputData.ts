import {TicketData, TicketDataInput} from "@/model/ticket-data";

export default function fromTicketDataToTicketInputData(ticket: TicketData): TicketDataInput {
    return {
        ticketTypeId: ticket.ticketType.id,
        childId: ticket.child.id,
        expirationDate: ticket.expirationDate,
        price: ticket.price,
        issueDate: ticket.issueDate,
        numberOfParticipation: ticket.numberOfParticipation,
    }
}