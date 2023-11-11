import {fullUrlClient} from "@/api/graphql/client";
import {gql} from "@apollo/client";
import {ChildData} from "@/model/child-data";

export default async function getChildById(childId: string): Promise<ChildData> {
    return fullUrlClient
    .query({
        query: gql`
            query GetChildById($id: String!){
                getChildById(id : $id){
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
        },
    }).then(value => value.data.getChildById);
}
