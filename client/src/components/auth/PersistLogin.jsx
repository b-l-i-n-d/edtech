import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthChecked, useCurrentVideoId } from '../../hooks';
import Common from '../common';

function PersistLogin() {
    const authChecked = useAuthChecked();
    const isCurrentVideoIdLoaded = useCurrentVideoId();
    return authChecked && isCurrentVideoIdLoaded ? <Outlet /> : <Common.Loader />;
}

export default PersistLogin;
