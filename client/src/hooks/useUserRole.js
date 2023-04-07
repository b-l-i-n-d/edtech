import { useSelector } from 'react-redux';

// This hook is used to check user role
export default function useUserRole() {
    const { role } = useSelector((state) => state.auth.user);

    if (role) {
        return role;
    }
    return undefined;
}
