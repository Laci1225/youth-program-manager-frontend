import {ApolloClient, NormalizedCacheObject} from '@apollo/client';
import {clientSideClient} from '@/api/graphql/client';
import {gql} from '@apollo/client';
import {TicketTypeData} from "@/model/ticket-type-data";

export default async function getAllTicketTypes(authToken: string | undefined,
                                                client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<TicketTypeData[]> {
    let value = await client.query({
        query: gql`
            query {
                getAllTicketTypes {
                    id
                    name
                    description
                    price
                    numberOfParticipation
                    standardValidityPeriod
                }
            }
        `, fetchPolicy: "no-cache",
        context: {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        },
    });
    return await value.data.getAllTicketTypes;
}