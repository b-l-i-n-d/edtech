import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';

function RequiredLogin() {
    const isLoggedIn = useAuth();
    const { pathname } = useLocation();
    const isAdmin = pathname.includes('admin');

    const redirectTo = isAdmin ? '/admin/login' : '/login';

    return isLoggedIn ? <Outlet /> : <Navigate to={redirectTo} />;
}

export default RequiredLogin;
