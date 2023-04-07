import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks';

function NotRequiredLogin() {
    // checking if the user is logged in
    const isLoggedIn = useAuth();

    return isLoggedIn ? <Navigate to="/" /> : <Outlet />;
}

export default NotRequiredLogin;
