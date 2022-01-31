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

const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_URL || "",
});
type Props = {
    children: JSX.Element | JSX.Element[]
}
const ApolloWrapper = ({ children }: Props) => {

    const { authState } = useOktaAuth()
    const isAuthenticated = authState?.isAuthenticated
    const accessToken = authState?.accessToken?.accessToken
    //const token=oktaAuth.acces
    const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | undefined>(undefined)
    useEffect(() => {
        console.log(authState)
        //console.log(oktaAuth)
        if (isAuthenticated) {
            console.log("authenticated and creating authLink")
            const authLink = setContext((_, { headers }) => {
                // get the authentication token from local storage if it exists
                // const token = authState.accessToken?.accessToken//localStorage.getItem('token'); //TODO, need a full login process with okta etc
                // return the headers to the context so httpLink can read them
                return {
                    headers: {
                        ...headers,
                        authorization: accessToken ? `Bearer ${accessToken}` : "",
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
        {children}
    </ApolloProvider > : <p>Loading</p>
}
export default ApolloWrapper