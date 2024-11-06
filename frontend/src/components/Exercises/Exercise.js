import { faInfo, faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Exercise.module.css';

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
    isCustom 
}) {

    return (
        <div className={styles.exercise}>
            <h2>{name}</h2>
            <p className={styles["exercise-description"]}>{description}</p>
            <div className={styles["exercise-footer"]}>
                <span>{bodypart}</span>

                <div className={styles["button-container"]}>
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
                                isCustom(true);
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