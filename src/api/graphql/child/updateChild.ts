import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {ChildData, ChildDataUpdateInput} from "@/model/child-data";

export default async function updateChild(childData: ChildDataUpdateInput,
                                          authToken: string | undefined,
                                          client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<ChildData> {
    let value = await client
    .mutate({
        mutation: gql`
            mutation UpdateChild($child: ChildUpdateInput!) {
                updateChild(child: $child){
                    id
                    familyName
                    givenName
                    birthDate
                    birthPlace
                    address
                    relativeParents {
                        id
                        isEmergencyContact
                    }
                    diagnosedDiseases {
                        name
                        diagnosedAt
                    }
                    regularMedicines {
                        name
                        dose
                        takenSince
                    }
                    hasDiagnosedDiseases
                    hasRegularMedicines
                }
            }
        `, fetchPolicy: "no-cache",
        variables: {
            child: childData
        },
        context: {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        },
    });
    return value.data.updateChild;
}
