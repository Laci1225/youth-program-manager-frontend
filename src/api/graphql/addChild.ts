import {client} from "@/api/graphql/client";
import {gql} from "@apollo/client";
import {ChildDataInput} from "@/model/child-data";

export default function addChild(values: ChildDataInput) {
    return client
    .mutate({
        mutation: gql`
            mutation AddChild($child: ChildInput!) {
                addChild(child: $child) {
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
            child: {
                familyName: values.familyName,
                givenName: values.givenName,
                birthDate: values.birthDate,
                birthPlace: values.birthPlace,
                address: values.address,
                diagnosedDiseases: values.diagnosedDiseases.map(disease => ({
                    name: disease.name,
                    diagnosedAt: disease.diagnosedAt
                })),
                regularMedicines: values.regularMedicines?.map(medicine => ({
                    name: medicine.name,
                    dose: medicine.dose,
                    takenSince: medicine?.takenSince,
                })),
            },
        },
    })
}