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
                    child {
                        id
                        givenName
                        familyName
                    }
                    ticketType{
                        id
                        name
                        price
                        numberOfParticipation
                        standardValidityPeriod
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
        `, fetchPolicy: "no-cache"
    });
    return await value.data.getAllTickets;
}