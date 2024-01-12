import {ApolloClient, NormalizedCacheObject} from '@apollo/client';
import {clientSideClient} from '@/api/graphql/client';
import {gql} from '@apollo/client';
import {TicketData} from "@/model/ticket-data";

export default async function getAllTickets(client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<TicketData[]> {
    let value = await client.query({
        query: gql`
            query {
                getAllTickets {
                    id
                    childId
                    ticketTypeId
                    issueDate
                    expirationDate
                    price
                    numberOfParticipation
                }
            }
        `, fetchPolicy: "no-cache"
    });
    return await value.data.getAllTickets;
}