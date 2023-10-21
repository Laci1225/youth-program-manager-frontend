import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {useState} from "react";
import {ChildData} from "@/model/child-data";

const client = new ApolloClient({
    uri: '/graphql',
    cache: new InMemoryCache(),
});

function Children() {

    const [children, setChildren] = useState<ChildData[]>()
    client
    .query({
        query: gql`
            query GetLocations {
                children {
                    givenName
                }
            }
        `,
    })
    .then((result) => setChildren(result.data.children));
    return (
        <div>
            <div className="container w-4/6 py-10">
                First name:
                {children ? children[0].givenName : ""}
            </div>
        </div>
    );
}

export default Children;
