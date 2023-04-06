import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import learningPortalImage from '../../assets/image/learningportal.svg';
import { userLoggedOut } from '../../features/auth/authSlice';

function Navbar() {
    const { name, role } = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const { pathname } = useLocation();

    const handleLogout = () => {
        dispatch(userLoggedOut());
    };

    return (
        <nav className="shadow-md fixed w-full bg-primary">
            <div className="max-w-7xl px-5 lg:px-0 mx-auto flex justify-between py-3">
                <Link to="/">
                    <img className="h-10" src={learningPortalImage} alt={learningPortalImage} />
                </Link>
                <div className="flex items-center gap-3">
                    {role === 'student' && (
                        <Link
                            to="/leaderboard"
                            className={pathname === '/leaderboard' ? 'font-bold' : 'text-white'}
                        >
                            Leaderboard
                        </Link>
                    )}
                    {role === 'admin' && (
                        <Link to="/" className={pathname === '/admin' ? 'font-bold' : 'text-white'}>
                            Dashboard
                        </Link>
                    )}
                    <h2
                        className={
                            pathname !== '/admin' && pathname !== '/leaderboard'
                                ? 'font-bold'
                                : 'text-white'
                        }
                    >
                        {name}
                    </h2>
                    <button
                        type="button"
                        className={`flex gap-2   items-center px-4 py-1 rounded-full text-sm transition-all  ${
                            role === 'student'
                                ? 'border border-cyan hover:bg-cyan'
                                : 'hover:bg-red-700 bg-red-600 font-medium'
                        }`}
                        onClick={handleLogout}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                            />
                        </svg>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
