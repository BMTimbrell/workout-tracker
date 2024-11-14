import { faInfo, faPencil, faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Exercises.module.css';

export default function Exercise({ 
    id, 
    name, 
    bodypart, 
    description, 
    openInfoModal, 
    openEditModal, 
    setExerciseId,
    setExerciseName,
    setExerciseBodypart, 
    setModalTitle, 
    userId, 
    isCustom ,
    isModal,
    addToModal,
    addToForm,
    exercisesAdded,
    removeFromForm
}) {

    return (
        <div className={styles.exercise}>
            <h2>{name}</h2>
            <p className={styles["exercise-description"]}>{description}</p>
            <div className={styles["exercise-footer"]}>
                <span>{bodypart}</span>

                <div className={styles["button-container"]}>
                    {isModal && (
                        <button 
                            onClick={() => {
                                if (exercisesAdded.find(e => e === id)) {
                                    removeFromForm(id);
                                } else {
                                    addToForm([id, [{ id: 0, weight: 0, reps: 0 }]]);
                                }
                            }} 
                            className={`button ${!exercisesAdded.find(e => e === id) ? "button-secondary" : "button-success"}`}
                        >
                            {!exercisesAdded.find(e => e === id) ? 
                                <FontAwesomeIcon icon={faPlus} /> :
                                <FontAwesomeIcon icon={faCheck} />
                            }
                        </button>
                    )}

                    <button 
                        onClick={() => {
                            openInfoModal();
                            setExerciseId(id); 
                            setModalTitle(name);
                            isCustom(userId && true);
                        }} 
                        className="button button-secondary"
                    >
                        <FontAwesomeIcon icon={faInfo} />
                    </button>

                    {userId && (
                        <button 
                            onClick={() => {
                                openEditModal();
                                setExerciseId(id);
                                setExerciseName(name);
                                setExerciseBodypart(bodypart);
                            }} 
                            className="button button-secondary"
                        >
                            <FontAwesomeIcon icon={faPencil} />
                        </button>
                    )}
                        
                </div>
            </div>
        </div>
    );
}