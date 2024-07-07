import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";

export default function getAllEmployee(authToken: string | undefined, client: ApolloClient<NormalizedCacheObject> = clientSideClient) {
    return client.query({
        query: gql`
            query {
                getAllEmployees {
                    id
                    email
                    familyName
                    givenName
                    phoneNumber
                    type
                }
            }
        `,
        fetchPolicy: "no-cache",
        context: {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        },
    }).then(value => value.data.getAllEmployees)
}