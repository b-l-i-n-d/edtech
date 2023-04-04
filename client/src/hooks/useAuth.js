import { useSelector } from 'react-redux';

export default function useAuth() {
    const { accessToken, user } = useSelector((state) => state.auth);

    if (accessToken && user) {
        return true;
    }
    return false;
}
