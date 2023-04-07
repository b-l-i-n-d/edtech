import { useSelector } from 'react-redux';

// This hook is used to check if the user is logged in or not
export default function useAuth() {
    const { accessToken, user } = useSelector((state) => state.auth);

    if (accessToken && user) {
        return true;
    }
    return false;
}
