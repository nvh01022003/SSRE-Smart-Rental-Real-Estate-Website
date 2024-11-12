// components/PublicRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = () => {
    const { isLoggedIn } = useSelector(state => state.auth);
    console.log('isLoggedIn', isLoggedIn);
    // return !isLoggedIn ? <Outlet /> : <Navigate to="/" />;
    if (isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;