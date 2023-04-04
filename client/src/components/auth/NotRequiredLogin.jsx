import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks';

function NotRequiredLogin() {
    const isLoggedIn = useAuth();

    return isLoggedIn ? <Navigate to="/" /> : <Outlet />;
}

export default NotRequiredLogin;
