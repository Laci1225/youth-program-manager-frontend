import {fullUrlClient} from "@/api/graphql/client";
import {gql} from "@apollo/client";
import {ChildData} from "@/model/child-data";

export default async function getAllChildren(): Promise<ChildData[]> {
    let value = await fullUrlClient
    .query({
        query: gql`
            query {
                getAllChildren {
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
    });
    return await value.data.getAllChildren;
}