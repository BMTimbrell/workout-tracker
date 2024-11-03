import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Exercise.module.css';

export default function Exercise({ id, name, bodypart, description, openModal, setExerciseId, setModalTitle }) {

    return (
        <div className={styles.exercise}>
            <h2>{name}</h2>
            <p className={styles["exercise-description"]}>{description}</p>
            <div className={styles["exercise-footer"]}>
                <p>{bodypart}</p>
                <button 
                    onClick={() => {
                        openModal();
                        setExerciseId(id); 
                        setModalTitle(name);
                    }} 
                    className="button button-secondary"
                >
                    <FontAwesomeIcon icon={faInfo} />
                </button>
            </div>
        </div>
    );
}