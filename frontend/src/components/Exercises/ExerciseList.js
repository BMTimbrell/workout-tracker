import Exercise from './Exercise';
import styles from './Exercise.module.css';

export default function ExerciseList({ exercises }) {
    return (
        <div className={styles['exercise-container']}>
            {exercises?.map(exercise => (
                <Exercise 
                    key={exercise.id}
                    name={exercise.name}
                    bodypart={exercise.bodypart}
                    description={exercise.description}
                />
            ))}
        </div>
    );
}