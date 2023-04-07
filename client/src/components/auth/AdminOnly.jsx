import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserRole } from '../../hooks';

function AdminOnly() {
    // Get the user role from redux store
    const role = useUserRole();

    // If the user is an admin, then proceed to admin page else redirect to user page
    return role === 'admin' ? <Outlet /> : <Navigate to="/" />;
}

export default AdminOnly;
