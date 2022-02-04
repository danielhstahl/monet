import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useOktaAuth } from '../okta-react/OktaContext';
import { LOGIN } from '../constants/routes';

const RequireAuth = () => {
    const { authState } = useOktaAuth()
    let location = useLocation()
    if (authState && !authState.isAuthenticated) {
        return <Navigate to={LOGIN} state={{ from: location }} replace />;
    }
    return <Outlet />
}

export default RequireAuth