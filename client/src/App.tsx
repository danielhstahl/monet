import './App.css';
import JobsPerProject from './components/JobsPerProject';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  useQuery,
  gql
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js';

const issuer = process.env.REACT_APP_OKTA_URL_BASE + '/oauth2/default'
const clientId = process.env.REACT_APP_OKTA_CLIENTID;
const redirect = process.env.REACT_APP_OKTA_APP_BASE_URL + '/callback';


const httpLink = createHttpLink({
  uri: process.env.REACT_GRAPHQL_URL,
});
const oktaAuth = new OktaAuth({
  issuer: issuer,
  clientId: clientId,
  redirectUri: redirect
});  
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token'); //TODO, need a full login process with okta etc
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
const Home=()=><div>Hello world</div>
const App=()=>(
  <ApolloProvider client={client}>
    <Security oktaAuth={oktaAuth}>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} ></Route>
        <SecureRoute path='/table' element={<JobsPerProject/>} />
        <Route path='/callback' element={<LoginCallback/>} />
      </Routes>
      </BrowserRouter>
      
    </Security>
    </ApolloProvider>
  )

export default App;
