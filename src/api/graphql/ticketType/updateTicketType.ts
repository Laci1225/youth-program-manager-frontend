import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {TicketTypeData, TicketTypeDataInput} from "@/model/ticket-type-data";

export default async function updateTicketType(ticketId: string,
                                               ticketData: TicketTypeDataInput,
                                               authToken: string | undefined,
                                               client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<TicketTypeData> {
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
        context: {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        },
    });
    return value.data.updateTicketType;
}