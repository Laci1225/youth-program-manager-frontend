import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {TicketData} from "@/model/ticket-data";

export default async function deleteTicket(ticketId: string, client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<TicketData> {
    let value = await client
    .mutate({
        mutation: gql`
            mutation DeleteTicket($id: String!) {
                deleteTicket(id : $id){
                    id
                    name
                    description
                    price
                    numberOfParticipants
                    standardValidityPeriod
                }
            }
        `,
        variables: {
            id: ticketId,
        },
    });
    return value.data.deleteTicket;
}