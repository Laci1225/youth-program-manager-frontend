import {clientSideClient} from "@/api/graphql/client";
import {gql} from "@apollo/client";
import {TicketDataInput} from "@/model/ticket-data";

export default function addTicket(values: TicketDataInput,
                                  authToken: string | undefined) {
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
        context: {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        },
    }).then(value => value.data.addTicket)
}