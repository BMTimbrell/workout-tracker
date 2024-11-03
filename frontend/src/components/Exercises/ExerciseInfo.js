import React from 'react';
import useFetch from '../../hooks/useFetch';
import { useUserContext } from '../../hooks/UserContext';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

export default function ExerciseInfo({ id }) {
    const { user } = useUserContext();
    const { loading, data: exercise, error }  = useFetch(user && id && `/users/${user?.id}/exercise/${id}`);


    return(
        <div style={{padding: "1rem"}}>
            {loading && <LoadingSpinner />}

            {exercise && !loading && !error && (
                <>
                    <h3 style={{margin: "1rem 0"}}>Description</h3>
                    <p>{exercise.description}</p>

                    <p style={{margin: "1rem 0"}}>
                        Muscles trained: &nbsp;
                        {
                            exercise.muscles.map((e, index) => (
                                <React.Fragment key={index}>
                                    {
                                        e[1] === "primary" ? 
                                        index === exercise.muscles.length - 1 ? <b>{e[0]}</b> : <><b>{e[0]}</b>, </>: 
                                        index === exercise.muscles.length - 1 ? e[0] : `${e[0]}, `
                                    }
                                </React.Fragment>
                            ))
                        }
                        .
                    </p>
                </>
            )}
        </div>
    );
}