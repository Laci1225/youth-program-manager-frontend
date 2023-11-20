import {client} from "@/api/graphql/client";
import {gql} from "@apollo/client";

export default function getAllChildren() {
    return client
    .query({
        query: gql`
            query {
                children {
                    id
                    familyName
                    givenName
                    birthDate
                    address
                    hasDiagnosedDiseases
                    hasRegularMedicines
                }
            }
        `,
    })
}