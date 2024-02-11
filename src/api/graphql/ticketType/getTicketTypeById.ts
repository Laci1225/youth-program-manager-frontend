import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {TicketTypeData} from "@/model/ticket-type-data";

export default async function getTicketTypeById(ticketId: string,
                                                authToken: string | undefined,
                                                client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<TicketTypeData> {
    return client
    .query({
        query: gql`
            query GetTicketTypeById($id: String!){
                getTicketTypeById(id : $id){
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
        },
        context: {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        },
    }).then(value => value.data.getTicketTypeById);
}