import { useUserContext } from '../../hooks/UserContext';
import { useEffect } from 'react';
import { logoutUser } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../Misc/LoadingSpinner/LoadingSpinner';

export default function Logout() {
    const { removeUser } = useUserContext();
    const navigate = useNavigate();

    useEffect(() => {
        logoutUser()
            .then(() => {
                removeUser();
                navigate('/login');
            })
            .catch(() => {
                removeUser();
                navigate('/login');
            });
    }, [navigate, removeUser]);

    return <LoadingSpinner />

}