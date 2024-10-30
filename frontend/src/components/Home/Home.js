import { useUserContext } from '../../hooks/UserContext';
import useFetch from '../../hooks/useFetch';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
    const { user } = useUserContext();
    const navigate = useNavigate();
    const { data: userData } = useFetch(user && `/users/${user?.id}`);

    useEffect(() => {
        if (userData?.authorisationFailed) {
            navigate('/logout');
        }
    }, [userData]);

    return (
        <>
            <h1>Start Workout</h1>

            {!user && (
                <p><Link to="/login">Log in</Link> to use this app.</p>
            )}
        </>
    );
}