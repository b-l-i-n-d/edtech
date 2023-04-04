import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserRole } from '../../hooks';

function AdminOnly() {
    const role = useUserRole();
    return role === 'admin' ? <Outlet /> : <Navigate to="/" />;
}

export default AdminOnly;
