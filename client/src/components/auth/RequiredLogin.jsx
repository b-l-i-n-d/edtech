import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';

function RequiredLogin() {
    // checking if the user is logged in
    const isLoggedIn = useAuth();
    const { pathname } = useLocation();

    // checking if the user is trying to access the admin page
    const isAdmin = pathname.includes('admin');

    const redirectTo = isAdmin ? '/admin/login' : '/login';

    return isLoggedIn ? <Outlet /> : <Navigate to={redirectTo} />;
}

export default RequiredLogin;
