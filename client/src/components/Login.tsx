import { ChangeEvent, FormEvent, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { Redirect } from 'react-router-dom';

const Login = () => {
    const { oktaAuth, authState } = useOktaAuth();
    const [sessionToken, setSessionToken] = useState<undefined | string>(undefined);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        oktaAuth.signInWithCredentials({ username, password })
            .then((res) => {
                const sessionToken = res.sessionToken;
                setSessionToken(sessionToken);
                // sessionToken is a one-use token, so make sure this is only called once
                oktaAuth.signInWithRedirect({ sessionToken });
            })
            .catch((err: Error) => console.log('Found an error', err));
    };

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value || "");
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value || "");
    };

    if (sessionToken) {
        // Hide form while sessionToken is converted into id/access tokens
        return null;
    }


    if (!authState) {
        return <div>Loading...</div>;
    }
    if (authState.isAuthenticated) {
        return <Redirect to={{ pathname: '/' }} />
    }
    else {
        return <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input
                    id="username" type="text"
                    value={username}
                    onChange={handleUsernameChange} />
            </label>
            <label>
                Password:
                <input
                    id="password" type="password"
                    value={password}
                    onChange={handlePasswordChange} />
            </label>
            <input id="submit" type="submit" value="Submit" />
        </form>
    }

}

export default Login