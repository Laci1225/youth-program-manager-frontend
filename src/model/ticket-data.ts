export interface TicketData {
    id: string
    name: string,
    description: string,
    price: number,
    numberOfParticipants: number
    standardValidityPeriod: number
}

export interface TicketDataInput {
    name: string,
    description: string,
    price: number,
    numberOfParticipants: number
    standardValidityPeriod: number
}