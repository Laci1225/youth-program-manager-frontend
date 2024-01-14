import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {TicketData} from "@/model/ticket-data";

export default async function deletedTicket(ticketId: string, client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<TicketData> {
    let value = await client
    .mutate({
        mutation: gql`
            mutation DeletedTicket($id: String!) {
                deletedTicket(id : $id){
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
        `,
        variables: {
            id: ticketId,
        },
    });
    return value.data.deletedTicket;
}