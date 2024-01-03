import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {ChildData} from "@/model/child-data";

export default async function getPotentialChildren(childName: string, client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<ChildData[]> {
    return client
    .query({
        query: gql`
            query GetPotentialChildren($name: String!){
                getPotentialChildren(name : $name){
                    id
                    familyName
                    givenName
                    birthDate
                }
            }
        `, fetchPolicy: "no-cache",
        variables: {
            name: childName,
        },
    }).then(value => value.data.getPotentialChildren);
}
