import { LOGIN } from '../constants/routes';
import { useNavigate } from 'react-router-dom';
import { useOktaAuth } from '../okta-react/OktaContext';

import {
    LogoutOutlined,
    LoginOutlined
} from '@ant-design/icons';
import { Button } from 'antd';
type Props = {
    isAuthenticated: boolean | undefined,
    signOut: () => Promise<void>,
    className?: string
}

const LogInButton = ({ className }: { className?: string }) => {
    const { authState, oktaAuth } = useOktaAuth()
    const signOut = () => oktaAuth.signOut()
    return <LogInButtonWithAuth className={className} isAuthenticated={authState?.isAuthenticated} signOut={signOut} />
}

export const LogInButtonWithAuth = ({ isAuthenticated, signOut, className }: Props) => {
    const navigate = useNavigate()
    const onClick = isAuthenticated ? () => {
        signOut()
        navigate(LOGIN)
    } : () => {
        navigate(LOGIN)
    }
    return <Button
        type="primary"
        className={className}
        onClick={onClick}
        icon={isAuthenticated ? <LogoutOutlined /> : <LoginOutlined />}
    >{isAuthenticated ? "Logout" : "Login"}</Button>
}
export default LogInButton