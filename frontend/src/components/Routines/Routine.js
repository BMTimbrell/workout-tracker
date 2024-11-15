import styles from './Routines.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

export default function Routine({ routine, openModal, setSelectedRoutine }) {
    return (
        <div className={styles.routine}>
            <div className={styles["routine-heading-container"]}>
                <h3>{routine.name}</h3>
                <button 
                    className="button button-secondary" 
                    onClick={() => {
                        openModal();
                        setSelectedRoutine({
                            id: routine.id,
                            name: routine.name,
                            exercises: routine.exercises[0] ? routine.exercises.map(exercise => {
                                return [exercise.id, exercise.sets]
                            }) : []
                        });
                    }}
                >
                    <FontAwesomeIcon icon={faPencil} />
                </button>
            </div>
            {routine?.exercises[0] && 
                <ul className={styles["exercise-container"]}>
                    {routine?.exercises.map((exercise, index) => (
                        <li key={index}>{exercise.name}</li>
                    ))}
                </ul>
            }
            <button className="button button-primary">Use Routine</button>
        </div>
    );
}