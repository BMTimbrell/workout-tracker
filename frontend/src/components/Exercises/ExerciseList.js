import Exercise from './Exercise';
import styles from './Exercises.module.css';

export default function ExerciseList({ 
    exercises, 
    openInfoModal, 
    openEditModal, 
    setExerciseId, 
    setExerciseName, 
    setExerciseBodypart, 
    setModalTitle, 
    isCustom, 
    isModal,
    addToForm,
    exercisesAdded,
    removeFromForm
}) {
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
                    isModal={isModal}
                    addToForm={addToForm}
                    exercisesAdded={exercisesAdded}
                    removeFromForm={removeFromForm}
                />
            ))}
        </div>
    );
}