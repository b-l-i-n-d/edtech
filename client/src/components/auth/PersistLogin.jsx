import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthChecked, useCurrentVideoId } from '../../hooks';
import Common from '../common';

function PersistLogin() {
    // waiting for the auth check to complete
    const authChecked = useAuthChecked();
    // waiting for the current video id to be loaded
    const isCurrentVideoIdLoaded = useCurrentVideoId();

    return authChecked && isCurrentVideoIdLoaded ? <Outlet /> : <Common.Loader />;
}

export default PersistLogin;
