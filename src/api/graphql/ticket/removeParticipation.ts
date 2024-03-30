import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {HistoryData, TicketData} from "@/model/ticket-data";

export default async function removeParticipation(ticketId: string,
                                                  historyData: HistoryData,
                                                  authToken: string | undefined,
                                                  client: ApolloClient<NormalizedCacheObject> = clientSideClient,
): Promise<TicketData> {
    return client
    .mutate({
        mutation: gql`
            mutation RemoveParticipation($id: String!, $historyData: HistoryDataInput!){
                removeParticipation(id : $id, historyData: $historyData){
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
        `, fetchPolicy: "no-cache",
        variables: {
            id: ticketId,
            historyData: historyData
        },
        context: {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        },
    }).then(value => value.data.removeParticipation);
}