export interface TicketTypeData {
    id: string
    name: string,
    description: string,
    price: number,
    numberOfParticipation: number
    standardValidityPeriod: number
}

export interface TicketTypeDataInput {
    name: string,
    description: string,
    price: number,
    numberOfParticipation: number
    standardValidityPeriod: number
}