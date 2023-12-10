import {clientSideClient} from "@/api/graphql/client";
import {gql} from "@apollo/client";
import {TicketDataInput} from "@/model/ticket-data";

export default function addTicketType(values: TicketDataInput) {
    return clientSideClient
    .mutate({
        mutation: gql`
            mutation AddTicket($ticket: TicketTypeInput!) {
                addTicketType(ticket: $ticket) {
                    id
                    name
                    price
                    description
                    numberOfParticipation
                    standardValidityPeriod
                }
            }
        `,
        variables: {
            ticket: {
                name: values.name,
                description: values.description,
                price: values.price,
                numberOfParticipation: values.numberOfParticipation,
                standardValidityPeriod: values.standardValidityPeriod
            },
        },
    }).then(value => value.data.addTicketType)
}