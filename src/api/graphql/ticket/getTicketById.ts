import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {TicketData} from "@/model/ticket-data";

export default async function getTicketById(ticketId: string, client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<TicketData> {
    return client
    .query({
        query: gql`
            query GetTicketById($id: String!){
                getTicketById(id : $id){
                    id
                    child {
                        givenName
                        familyName
                    }
                    ticketType{
                        name
                        price
                        numberOfParticipation
                        standardValidityPeriod
                    }
                    issueDate
                    expirationDate
                    price
                    numberOfParticipation
                }
            }
        `, fetchPolicy: "no-cache",
        variables: {
            id: ticketId,
        },
    }).then(value => value.data.getTicketById);
}