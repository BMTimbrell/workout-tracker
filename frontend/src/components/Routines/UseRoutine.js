import UseRoutineExercise from './UseRoutineExercise';
import styles from './UseRoutine.module.css';

export default function UseRoutine({ routine }) {

    return (
        <div className={styles.container}>
            {routine.exercises.length > 0 ? routine.exercises.map((exercise, index) => (
                <UseRoutineExercise key={index} data={exercise} />
            )) : <p>Routine is empty.</p>}
        </div>
    );
}