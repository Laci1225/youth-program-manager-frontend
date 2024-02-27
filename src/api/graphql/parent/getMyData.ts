import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {ParentDataWithChildren} from "@/model/parent-data";

export default async function getMyData(authToken: string | undefined,
                                        client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<ParentDataWithChildren> {
    return client
    .query({
        query: gql`
            query {
                getMyData {
                    id
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
        context: {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        },
    }).then(value => value.data.getMyData);
}