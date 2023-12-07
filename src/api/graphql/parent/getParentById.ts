import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";

export default async function getParentById(parentId: string, client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<ParentData> {
    return client
    .query({
        query: gql`
            query GetParentById($id: String!){
                getParentById(id : $id){
                    id
                    familyName
                    givenName
                    phoneNumbers
                    address
                }
            }
        `, fetchPolicy: "no-cache",
        variables: {
            id: parentId,
        },
    }).then(value => value.data.getParentById);
}