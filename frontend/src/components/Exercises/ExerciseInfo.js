import useFetch from '../../hooks/useFetch';
import { useUserContext } from '../../hooks/UserContext';
import LoadingSpinner from '../Misc/LoadingSpinner/LoadingSpinner';
import Error from '../Misc/Error/Error';
import styles from './ExerciseInfo.module.css';

export default function ExerciseInfo({ id }) {
    const { user } = useUserContext();
    const { loading, data: exercise, error }  = useFetch(user && id && `/users/${user?.id}/exercises/${id}`);

    return(
        <div>
            {loading ? <LoadingSpinner /> : error ? <Error text="Failed to load data" /> : undefined}

            {exercise && !loading && !error && (
                <>
                    <h3 className={styles.heading}>Instructions</h3>
                    <p className={styles.p}>{exercise.description}</p>

                    <h3 className={styles.heading}>Muscles Trained</h3>

                    <ul>
                        {
                            exercise.muscles.map((e, index) => (
                                <li className={styles.muscle} key={index}>
                                    {
                                        e[1] === "primary" ? <b>{e[0]}</b> : e[0]
                                    }
                                </li>
                            ))
                        }
                    </ul>
                </>
            )}
        </div>
    );
}