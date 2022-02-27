import { useState } from 'react';
import { useOktaAuth } from '../okta-react/OktaContext';
import { Navigate } from 'react-router-dom';
import { Form, Input, Button, Spin } from 'antd';
import { HOME } from '../constants/routes';

type FormValues = {
    username: string,
    password: string
}

type LoginProp = {
    handleSubmit: (obj0: FormValues) => Promise<void>
}
const margin = {
    marginTop: "20%"
}
const LoginForm = ({ handleSubmit }: LoginProp) => {
    const [loading, setLoading] = useState(false)
    const [loginError, setLoginError] = useState<undefined | string>(undefined)
    const onFinish = (values: FormValues) => {
        setLoading(true)
        handleSubmit(values).catch(err => setLoginError(err.message)).finally(() => setLoading(false))
    }
    return <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        style={margin}
        autoComplete="off"
    >
        <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
            wrapperCol={{ span: 8 }}
        >
            <Input />
        </Form.Item>

        <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            wrapperCol={{ span: 8 }}
        >
            <Input.Password />
        </Form.Item>

        <Form.Item
            wrapperCol={{ offset: 8, span: 8 }}
            validateStatus={loginError && "error"}
            help={loginError}
        >
            <Button type="primary" htmlType="submit" loading={loading}>
                Submit
            </Button>
        </Form.Item>
    </Form>
}

const Login = ({ from }: { from?: string }) => {
    const { oktaAuth, authState } = useOktaAuth();
    const [sessionToken, setSessionToken] = useState<undefined | string>(undefined);
    const handleSubmit = ({ username, password }: FormValues) => {
        return oktaAuth.signInWithCredentials({ username, password })
            .then((res) => {
                const sessionToken = res.sessionToken;
                setSessionToken(sessionToken);
                oktaAuth.signInWithRedirect({ sessionToken });
            })
    };
    if (sessionToken) {
        return null;
    }
    if (!authState) {
        return <Spin />
    }
    if (authState.isAuthenticated) {
        return <Navigate to={from || HOME} />
    }
    return <LoginForm handleSubmit={handleSubmit} />

}

export default Login