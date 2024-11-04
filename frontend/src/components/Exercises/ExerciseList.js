import Exercise from './Exercise';
import styles from './Exercise.module.css';

export default function ExerciseList({ exercises, openInfoModal, openEditModal, setExerciseId, setModalTitle }) {
    return (
        <div className={styles['exercise-container']}>
            {exercises?.map(exercise => (
                <Exercise 
                    key={exercise.id}
                    id={exercise.id}
                    userId={exercise.userId}
                    name={exercise.name}
                    bodypart={exercise.bodypart}
                    description={exercise.description}
                    openInfoModal={openInfoModal}
                    openEditModal={openEditModal}
                    setExerciseId={setExerciseId}
                    setModalTitle={setModalTitle}
                />
            ))}
        </div>
    );
}