import {ApolloClient, InMemoryCache} from "@apollo/client";

export const clientSideClient = new ApolloClient({
    uri: '/graphql',
    cache: new InMemoryCache({
        addTypename: false,
        resultCaching: false,
        resultCacheMaxSize: 0,
    }),
});
export const serverSideClient = new ApolloClient({
    uri: 'http://localhost:8080/graphql',
    cache: new InMemoryCache({
        addTypename: false,
        resultCaching: false,
        resultCacheMaxSize: 0
    }),
});
