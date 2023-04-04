import React from 'react';
import { Outlet } from 'react-router-dom';
import Common from '../components/common';

function Layout() {
    return (
        <>
            <Common.Navbar />

            <section className="py-6 bg-primary pt-20">
                <div className="mx-auto max-w-7xl px-5 lg:px-0">
                    <Outlet />
                </div>
            </section>
        </>
    );
}

export default Layout;
