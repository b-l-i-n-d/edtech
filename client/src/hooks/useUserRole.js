import { useSelector } from 'react-redux';

export default function useUserRole() {
    const { role } = useSelector((state) => state.auth.user);

    if (role) {
        return role;
    }
    return undefined;
}
