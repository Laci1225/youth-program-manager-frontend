import {clientSideClient} from "@/api/graphql/client";
import {gql} from "@apollo/client";
import {TicketDataInput} from "@/model/ticket-data";

export default function addTicket(values: TicketDataInput) {
    return clientSideClient
    .mutate({
        mutation: gql`
            mutation AddTicket($ticket: TicketInput!) {
                addTicket(ticket: $ticket) {
                    id
                    child {
                        givenName
                        familyName
                    }
                    ticketType{
                        name
                        price
                        numberOfParticipation
                        standardValidityPeriod
                    }
                    issueDate
                    expirationDate
                    price
                    numberOfParticipation
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