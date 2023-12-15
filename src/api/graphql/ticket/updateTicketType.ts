import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {TicketData, TicketDataInput} from "@/model/ticket-data";

export default async function updateTicketType(ticketId: string, ticketData: TicketDataInput, client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<TicketData> {
    let value = await client
    .mutate({
        mutation: gql`
            mutation UpdateTicketType($id: String!,$ticket: TicketTypeInput!) {
                updateTicketType(id : $id,ticket: $ticket){
                    id
                    name
                    description
                    price
                    numberOfParticipation
                    standardValidityPeriod
                }
            }
        `, fetchPolicy: "no-cache",
        variables: {
            id: ticketId,
            ticket: ticketData
        },
    });
    return value.data.updateTicketType;
}