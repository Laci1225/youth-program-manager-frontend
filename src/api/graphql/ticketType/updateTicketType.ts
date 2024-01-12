import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {TicketTypeData, TicketTypeDataInput} from "@/model/ticket-type-data";

export default async function updateTicketType(ticketId: string, ticketData: TicketTypeDataInput, client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<TicketTypeData> {
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