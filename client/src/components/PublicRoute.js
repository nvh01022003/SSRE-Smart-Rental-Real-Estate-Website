// components/PublicRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = () => {
    const { isLoggedIn } = useSelector(state => state.auth);
    return !isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default PublicRoute;