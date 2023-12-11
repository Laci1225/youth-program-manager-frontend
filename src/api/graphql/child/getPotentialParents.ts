import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {ChildData} from "@/model/child-data";
import {ParentData} from "@/model/parent-data";

export default async function getPotentialParents(parentName: string, client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<ParentData[]> {
    return client
    .query({
        query: gql`
            query GetPotentialParents($name: String!){
                getPotentialParents(name : $name){
                    id
                    familyName
                    givenName
                    phoneNumbers
                }
            }
        `, fetchPolicy: "no-cache",
        variables: {
            name: parentName,
        },
    }).then(value => value.data.getPotentialParents);
}
