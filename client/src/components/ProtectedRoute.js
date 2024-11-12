// components/ProtectedRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
    const { isLoggedIn } = useSelector(state => state.auth);
    //return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;