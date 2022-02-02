import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
    NormalizedCacheObject,
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context'
import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_URL || "",
});
type Props = {
    children?: JSX.Element | JSX.Element[]
}
const ApolloWrapper = () => {

    const { authState } = useOktaAuth()
    const isAuthenticated = authState?.isAuthenticated
    const accessToken = authState?.idToken?.idToken
    //const token=oktaAuth.acces
    const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | undefined>(undefined)
    useEffect(() => {
        if (isAuthenticated) {
            const authLink = setContext((_, { headers }) => {
                return {
                    headers: {
                        ...headers,
                        authorization: accessToken ? `${accessToken}` : "",
                    }
                }
            });
            setClient(new ApolloClient({
                link: authLink.concat(httpLink),
                cache: new InMemoryCache()
            }))
        }
    }, [isAuthenticated, accessToken])
    return client ? < ApolloProvider client={client} >
        <Outlet />
    </ApolloProvider > : <p>Loading</p>
}
export default ApolloWrapper