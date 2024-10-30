import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Exercise.module.css';

export default function Exercise({ name, bodypart, description }) {
    return (
        <div className={styles.exercise}>
            <h2>{name}</h2>
            <div className={styles["exercise-footer"]}>
                <p>{bodypart}</p>
                {/* <p>{description}</p> */}
                <button className={styles.btn}><FontAwesomeIcon icon={faInfo} /></button>
            </div>
        </div>
    );
}