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
                    name
                    price
                    description
                    numberOfParticipants
                    standardValidityPeriod
                }
            }
        `,
        variables: {
            ticket: {
                name: values.name,
                description: values.description,
                price: values.price,
                numberOfParticipants: values.numberOfParticipants,
                standardValidityPeriod: values.standardValidityPeriod
            },
        },
    }).then(value => value.data.addTicket)
}