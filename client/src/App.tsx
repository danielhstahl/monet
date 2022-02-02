import './App.css';
import ApiKey from './components/ApiKey'
import Home from './components/Home';

import { Security, LoginCallback, } from '@okta/okta-react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import Login from './components/Login';
import ApolloWrapper from './components/ApolloWrapper';
import Metrics from './pages/Metrics';
import RequireAuth from './components/RequireAuth'
const issuer = process.env.REACT_APP_OKTA_ISSUER

//since there should be a 1-1 between client id and company, FOR NOW we will us this as the company
const clientId = process.env.REACT_APP_OKTA_ID || ""

const REDIRECT_URL = '/login/callback'




const App = () => {
  const oktaAuth = new OktaAuth({
    issuer: issuer,
    clientId: clientId,
    redirectUri: window.location.origin + REDIRECT_URL,
  });
  const navigate = useNavigate();
  const restoreOriginalUri = async (_: any, originalUri: string) => {
    console.log(originalUri)
    navigate(toRelativeUrl(originalUri || '/', window.location.origin), { replace: true });
  };
  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} >
      <Routes>
        <Route path={REDIRECT_URL} element={<LoginCallback />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Home />} >
          <Route index element={<p>hello world</p>} />
          <Route element={<RequireAuth />}>
            <Route element={<ApolloWrapper />}>
              <Route path='metrics' element={<Metrics company={clientId} />} />
              <Route path='apikey' element={<ApiKey company={clientId} />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Security >
  )
}
export default App;
