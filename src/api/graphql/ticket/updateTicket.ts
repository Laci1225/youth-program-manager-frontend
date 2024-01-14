import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {TicketData, TicketDataInput} from "@/model/ticket-data";

export default async function updateTicket(ticketId: string, ticketData: TicketDataInput, client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<TicketData> {
    let value = await client
    .mutate({
        mutation: gql`
            mutation UpdateTicket($id: String!,$ticket: TicketInput!) {
                updateTicket(id : $id,ticket: $ticket){
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
                }
            }
        `, fetchPolicy: "no-cache",
        variables: {
            id: ticketId,
            ticket: ticketData
        },
    });
    return value.data.updateTicket;
}