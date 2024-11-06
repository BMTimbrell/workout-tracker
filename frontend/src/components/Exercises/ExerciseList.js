import Exercise from './Exercise';
import styles from './Exercise.module.css';

export default function ExerciseList({ exercises, openInfoModal, openEditModal, setExerciseId, setExerciseName, setExerciseBodypart, setModalTitle, isCustom }) {
    return (
        <div className={styles['exercise-container']}>
            {exercises?.map(exercise => (
                <Exercise 
                    key={exercise.id}
                    id={exercise.id}
                    userId={exercise["user_id"]}
                    name={exercise.name}
                    bodypart={exercise.bodypart}
                    description={exercise.description}
                    openInfoModal={openInfoModal}
                    openEditModal={openEditModal}
                    setExerciseId={setExerciseId}
                    setExerciseName={setExerciseName}
                    setExerciseBodypart={setExerciseBodypart}
                    setModalTitle={setModalTitle}
                    isCustom={isCustom}
                />
            ))}
        </div>
    );
}