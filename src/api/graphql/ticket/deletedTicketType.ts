import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {TicketData} from "@/model/ticket-data";

export default async function deletedTicketType(ticketId: string, client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<TicketData> {
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
    });
    return value.data.deleteTicketType;
}