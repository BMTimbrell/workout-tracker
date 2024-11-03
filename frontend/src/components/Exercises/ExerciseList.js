import Exercise from './Exercise';
import styles from './Exercise.module.css';

export default function ExerciseList({ exercises, openModal, setExerciseId, setModalTitle }) {
    return (
        <div className={styles['exercise-container']}>
            {exercises?.map(exercise => (
                <Exercise 
                    key={exercise.id}
                    id={exercise.id}
                    name={exercise.name}
                    bodypart={exercise.bodypart}
                    description={exercise.description}
                    openModal={openModal}
                    setExerciseId={setExerciseId}
                    setModalTitle={setModalTitle}
                />
            ))}
        </div>
    );
}