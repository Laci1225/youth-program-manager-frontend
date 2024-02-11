import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {TicketTypeData} from "@/model/ticket-type-data";

export default async function deletedTicketType(ticketId: string,
                                                authToken: string | undefined,
                                                client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<TicketTypeData> {
    let value = await client
    .mutate({
        mutation: gql`
            mutation DeletedTicketType($id: String!) {
                deletedTicketType(id : $id){
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