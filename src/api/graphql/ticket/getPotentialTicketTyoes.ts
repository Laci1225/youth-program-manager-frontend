import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {TicketTypeData} from "@/model/ticket-type-data";

export default async function getPotentialTicketTypes(ticketTypeName: string, limit: number, client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<TicketTypeData[]> {
    return client
    .query({
        query: gql`
            query GetPotentialTicketTypes($name: String!){
                getPotentialTicketTypes(name : $name){
                    id
                    name
                    standardValidityPeriod
                    price
                    description
                    numberOfParticipation
                }
            }
        `, fetchPolicy: "no-cache",
        variables: {
            name: ticketTypeName,
        },
    }).then(value => value.data.getPotentialTicketTypes.slice(0, limit));
}
