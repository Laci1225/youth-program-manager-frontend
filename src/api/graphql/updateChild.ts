import {client} from "@/api/graphql/client";
import {gql} from "@apollo/client";
import {ChildData, ChildDataInput} from "@/model/child-data";

export default async function updateChild(childId: string, childData: ChildDataInput): Promise<ChildData> {
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
        `,
        variables: {
            id: childId,
            child: childData
        },
    });
    return value.data.updateChild;
}
