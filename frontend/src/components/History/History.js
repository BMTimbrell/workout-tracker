import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../hooks/UserContext';

export default function History() {
    const { user } = useUserContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const updateWorkouts = useCallback(async () => {
        setLoading(true);
        // const controller = new AbortController();

        // const response = await getRoutines(user?.id, controller);

        // if (response?.authorisationFailed) {
        //     navigate('/logout');
        // } else if (response?.abortError) {
        //     setError(false);
        // } else if (response) {
        //     setError(false);
        //     setRoutines(response.routines);
        // } else {
        //     setError(true);
        // }

        setLoading(false);
    }, [navigate, user?.id]);

    useEffect(() => {
        updateWorkouts();
    }, [updateWorkouts]);

    return (
        <>
            <h1>History</h1>


        </>
    );
}