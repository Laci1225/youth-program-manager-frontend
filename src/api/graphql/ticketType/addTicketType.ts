import {clientSideClient} from "@/api/graphql/client";
import {gql} from "@apollo/client";
import {TicketTypeDataInput} from "@/model/ticket-type-data";

export default function addTicketType(values: TicketTypeDataInput) {
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