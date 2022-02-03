import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
    NormalizedCacheObject,
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context'
import { useOktaAuth } from '../okta-react/OktaContext';
import { Spin } from "antd";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_URL || "",
});

type Props = {
    isAuthenticated: boolean | undefined,
    accessToken: string | undefined
}

const ApolloWrapper = () => {
    const { authState } = useOktaAuth()
    const isAuthenticated = authState?.isAuthenticated
    const accessToken = authState?.idToken?.idToken
    return <ApolloProviderWithAuth isAuthenticated={isAuthenticated} accessToken={accessToken} />
}

export const ApolloProviderWithAuth = ({ isAuthenticated, accessToken }: Props) => {
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
    </ApolloProvider > : <Spin />
}
export default ApolloWrapper