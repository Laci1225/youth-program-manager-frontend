import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {TicketData} from "@/model/ticket-data";

export default async function getTicketTypeById(ticketId: string, client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<TicketData> {
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
    }).then(value => value.data.getTicketTypeById);
}