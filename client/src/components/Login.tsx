import { useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { Navigate } from 'react-router-dom';
import { Form, Input, Button, Spin } from 'antd';

type FormValues = {
    username: string,
    password: string
}

type LoginProp = {
    handleSubmit: (obj0: FormValues) => void
}

const LoginForm = ({ handleSubmit }: LoginProp) => <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    initialValues={{ remember: true }}
    onFinish={handleSubmit}
    //onFinishFailed={onFinishFailed}
    autoComplete="off"
>
    <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
    >
        <Input />
    </Form.Item>

    <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
    >
        <Input.Password />
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
            Submit
        </Button>
    </Form.Item>
</Form>

const Login = ({ from }: { from?: string }) => {
    const { oktaAuth, authState } = useOktaAuth();
    const [sessionToken, setSessionToken] = useState<undefined | string>(undefined);

    const handleSubmit = ({ username, password }: FormValues) => {
        oktaAuth.signInWithCredentials({ username, password })
            .then((res) => {
                const sessionToken = res.sessionToken;
                setSessionToken(sessionToken);
                oktaAuth.signInWithRedirect({ sessionToken });
            })
            .catch((err: Error) => console.log('Found an error', err));
    };
    if (sessionToken) {
        return null;
    }
    if (!authState) {
        return <Spin />
    }
    if (authState.isAuthenticated) {
        return <Navigate to={from || "/"} />
    }
    return <LoginForm handleSubmit={handleSubmit} />

}

export default Login