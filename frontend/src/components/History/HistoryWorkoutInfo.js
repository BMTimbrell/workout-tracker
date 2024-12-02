import { ExerciseSets } from '../Exercises/ExerciseHistory';
import useFetch from '../../hooks/useFetch';
import { useUserContext } from '../../hooks/UserContext';
import LoadingSpinner from '../Misc/LoadingSpinner/LoadingSpinner';
import Error from '../Misc/Error/Error';
import styles from './HistoryWorkoutInfo.module.css';

export default function HistoryWorkoutInfo({ exercises }) {

    return (
        <div className={styles.container}>
            {exercises && exercises.map((exercise, index) => (
                <HistoryWorkoutExercise 
                    key={index} 
                    id={exercise[0]} 
                    sets={exercise[1]} 
                />
            ))}
        </div>
    );
}

function HistoryWorkoutExercise({ id, sets }) {
    const { user } = useUserContext();
    const [exercise, loading, error]  = useFetch(user && id && `/users/${user?.id}/exercises/${id}/name`);


    return (
        <>
            {exercise && !loading && !error ? <ExerciseSets sets={sets} title={exercise.name} weightConverted={true} /> :
                loading ? <LoadingSpinner /> : error ? <Error text="Failed to load data." /> : undefined
            }    
        </>  
    );
}