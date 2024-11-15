import useFetch from '../../hooks/useFetch';
import { useUserContext } from '../../hooks/UserContext';
import LoadingSpinner from '../Misc/LoadingSpinner/LoadingSpinner';
import Error from '../Misc/Error/Error';
import styles from './RoutineExercise.module.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashCan, faRotate, faRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import DropdownButton from '../Misc/DropdownButton/DropdownButton';

export default function RoutineExercise({ id, index, exercises, setExercises, selectedExercise, toggleSelected, replace, openDeleteModal }) {
    const { user } = useUserContext();
    const [exercise, loading, error]  = useFetch(user && id && `/users/${user?.id}/exercises/${id}/name`);

    const handleChange = (e, setIndex) => {
        setExercises(exercises.map((el, elIndex) => {
            if (index === elIndex) {
                el[1] = el[1].map((s, sIndex) => {
                    if (setIndex === sIndex) {
                        if (e.target.name === "weight") {
                            s.weight = e.target.value;
                        } else if (e.target.name === "reps") {
                            s.reps = e.target.value;
                        }
                    }
                    return s;
                });
            }
            return el;
        }));
    };

    const deleteSet = setIndex => {
        setExercises(exercises.map((el, elIndex) => {
            if (index === elIndex) {
                el[1] = el[1].filter((s, sIndex) => {
                    return sIndex !== setIndex;
                });
            }
            return el;
        }));
    };

    return (
        <div className={styles.exercise}>
            {loading ? <LoadingSpinner /> : error ? <Error text="Failed to load data" /> : undefined}

            {exercise && !loading && !error && (
                <>
                    <div className={styles.header}>
                        <h3>{exercise.name}</h3>
                        <div className={styles["button-container"]}>

                            <button 
                                type="button" 
                                className={selectedExercise === exercises[index] ? 'button button-success' : 'button button-secondary'}
                                onClick={() => toggleSelected(exercises[index])}
                            >
                                <FontAwesomeIcon icon={faRotate} />
                            </button>

                            <DropdownButton>
                                <button 
                                    type="button" 
                                    className="button"
                                    onClick={replace}
                                >
                                    <FontAwesomeIcon style={{color: 'var(--primary)'}} icon={faRotateLeft}/>
                                    <span>Replace</span>
                                </button>

                                <button 
                                    type="button" 
                                    className="button"
                                    onClick={() => openDeleteModal({ index, name: exercise.name })}
                                >
                                    <FontAwesomeIcon style={{color: 'var(--danger)'}} icon={faTrashCan}/>
                                    <span>Delete</span>
                                </button>
                            </DropdownButton>
                        </div>
                    </div>

                    <div className={styles.sets}>
                        <span className={styles["sets-heading"]}>Set</span>
                        <span className={styles["sets-heading"]}>kg</span>
                        <span className={styles["sets-heading"]}>Reps</span>
                        <span></span>

                        {exercises[index][1].map((set, setIndex) => (
                            <React.Fragment key={setIndex}>
                                <span>{setIndex + 1}</span>
                                <input min="0" name="weight" type="number" value={set.weight ? set.weight : ''} onChange={e => handleChange(e, setIndex)} />
                                <input min="1" name="reps" type="number" value={set.reps ? set.reps : ''} onChange={e => handleChange(e, setIndex)} />
                                <button 
                                    type="button"
                                    className="button button-danger"
                                    onClick={() => deleteSet(setIndex)}
                                >
                                    <FontAwesomeIcon icon={faTrashCan} />
                                </button>
                            </React.Fragment>
                        ))}
                    
                        <button 
                            type="button" 
                            className="button button-tertiary"
                            onClick={() => setExercises(exercises.map((el, elIndex) => {
                                if (index === elIndex) {
                                    el[1] = [...el[1], { id: 0, weight: 0, reps: 0 }];
                                }
                                return el;
                            }))}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            <span>Add Set</span>
                        </button>
                    </div>

                </>
            )}
        </div>
    );
}