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
        `, fetchPolicy: "no-cache",
        variables: {
            ticket: {
                name: values.name,
                description: values.description,
                price: values.price,
                numberOfParticipation: values.numberOfParticipation,
                standardValidityPeriod: values.standardValidityPeriod
            }, fetchPolicy: "no-cache"
        },
    }).then(value => value.data.addTicketType)
}