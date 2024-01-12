export interface TicketData {
    id: string
    childId: string
    ticketTypeId: string,
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