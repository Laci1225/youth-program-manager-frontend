import {clientSideClient} from "@/api/graphql/client";
import {gql} from "@apollo/client";
import {TicketData, TicketDataInput} from "@/model/ticket-data";

export default function addTicket(values: TicketDataInput): Promise<TicketData> {
    return clientSideClient
    .mutate({
        mutation: gql`
            mutation AddTicket($ticket: TicketInput!) {
                addTicket(ticket: $ticket) {
                    id
                    child {
                        id
                        givenName
                        familyName
                        birthDate
                    }
                    ticketType{
                        id
                        name
                        price
                        numberOfParticipation
                        standardValidityPeriod
                    }
                    issueDate
                    expirationDate
                    price
                    numberOfParticipation
                    historyLog {
                        date
                        reporter
                    }
                }
            }
        `, fetchPolicy: "no-cache",
        variables: {
            ticket: {
                childId: values.childId,
                ticketTypeId: values.ticketTypeId,
                numberOfParticipation: values.numberOfParticipation,
                issueDate: values.issueDate,
                expirationDate: values.expirationDate,
                price: values.price
            }, fetchPolicy: "no-cache"
        },
    }).then(value => value.data.addTicket)
}