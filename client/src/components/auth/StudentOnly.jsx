import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserRole } from '../../hooks';

function Studentonly() {
    const role = useUserRole();
    return role === 'student' ? <Outlet /> : <Navigate to="/admin" />;
}

export default Studentonly;
