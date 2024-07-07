import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {TicketTypeData} from "@/model/ticket-type-data";

export default async function deleteTicketType(ticketId: string,
                                               authToken: string | undefined,
                                               client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<TicketTypeData> {
    let value = await client
    .mutate({
        mutation: gql`
            mutation DeleteTicketType($id: String!) {
                deleteTicketType(id : $id){
                    id
                    name
                    description
                    price
                    numberOfParticipation
                    standardValidityPeriod
                }
            }
        `,
        variables: {
            id: ticketId,
        },
        context: {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        },
    });
    return value.data.deleteTicketType;
}