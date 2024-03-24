import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {ParentDataWithChildren} from "@/model/parent-data";

export default async function getParentById(parentId: string,
                                            authToken: string | undefined,
                                            client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<ParentDataWithChildren> {
    return client
    .query({
        query: gql`
            query GetParentById($id: String!){
                getParentById(id : $id){
                    id
                    email
                    familyName
                    givenName
                    phoneNumbers
                    address
                    childDtos {
                        id
                        givenName
                        familyName
                        birthDate
                        relativeParents {
                            id
                            isEmergencyContact
                        }
                        birthPlace
                        address
                    }
                }
            }
        `, fetchPolicy: "no-cache",
        variables: {
            id: parentId,
        },
        context: {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        },
    }).then(value => value.data.getParentById);
}