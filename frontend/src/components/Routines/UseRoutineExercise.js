import useFetch from '../../hooks/useFetch';
import { useUserContext } from '../../hooks/UserContext';
import Error from '../Misc/Error/Error';
import LoadingSpinner from '../Misc/LoadingSpinner/LoadingSpinner';
import styles from './UseRoutineExercise.module.css';

export default function UseRoutineExercise({ data }) {
    const { user } = useUserContext();
    const [exercise, loading, error]  = useFetch(user && data[0] && `/users/${user?.id}/exercises/${data[0]}/name/bodypart`);

    return (
        <div className={styles.container}>
            {loading ? <LoadingSpinner /> : error ? <Error text="Failed to load data" /> : undefined}

            {
                exercise && !loading && (
                    <ul className={styles.list}>
                        <li>{`${data[1].length} x ${exercise.name}`}</li>
                        <li>{exercise.bodypart}</li>
                    </ul>
                )
            }
        </div>
    );
}