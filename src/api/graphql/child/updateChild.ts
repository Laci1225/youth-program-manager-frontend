import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {ChildData, ChildDataInput} from "@/model/child-data";

export default async function updateChild(childId: string, childData: ChildDataInput, client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<ChildData> {
    let value = await client
    .mutate({
        mutation: gql`
            mutation UpdateChild($id: String!,$child: ChildInput!) {
                updateChild(id : $id,child: $child){
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
            id: childId,
            child: childData
        },
    });
    return value.data.updateChild;
}
