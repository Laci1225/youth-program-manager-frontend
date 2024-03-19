import {ApolloClient, NormalizedCacheObject} from '@apollo/client';
import {clientSideClient} from '@/api/graphql/client';
import {gql} from '@apollo/client';
import {TicketData} from "@/model/ticket-data";

export default async function getAllTickets(authToken: string | undefined,
                                            client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<TicketData[]> {
    let value = await client.query({
        //todo updatenél csak az adat
        query: gql`
            query {
                getAllTickets {
                    id
                    child {
                        id
                        givenName
                        familyName
                        birthDate
                    }
                    ticketType{
                        id
                        name
                        price
                        numberOfParticipation
                        standardValidityPeriod
                        description
                    }
                    issueDate
                    expirationDate
                    price
                    numberOfParticipation
                    historyLog {
                        date
                        reporter
                    }
                }
            }
        `, fetchPolicy: "no-cache",
        context: {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        },
    });
    return await value.data.getAllTickets;
}