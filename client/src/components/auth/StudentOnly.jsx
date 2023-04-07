import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserRole } from '../../hooks';

function Studentonly() {
    // Get the user role from redux store
    const role = useUserRole();

    // If the user is an student, then proceed to student page else redirect to admin page
    return role === 'student' ? <Outlet /> : <Navigate to="/admin" />;
}

export default Studentonly;
