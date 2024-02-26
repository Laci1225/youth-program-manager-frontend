import {clientSideClient, serverSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";

export default async function getAllRoles(authToken: string | undefined,
                                          client: ApolloClient<NormalizedCacheObject> = serverSideClient): Promise<string[]> {
    let value = await client.query({
        query: gql`
            query {
                getAllRoles
            }
        `, fetchPolicy: "no-cache",
        context: {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        },
    });
    return await value.data.getAllRoles;
}