import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {TicketData} from "@/model/ticket-data";

export default async function deletedTicket(ticketId: string,
                                            authToken: string | undefined,
                                            client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<TicketData> {
    let value = await client
    .mutate({
        mutation: gql`
            mutation DeleteTicket($id: String!) {
                deleteTicket(id : $id){
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
    return value.data.deleteTicket;
}