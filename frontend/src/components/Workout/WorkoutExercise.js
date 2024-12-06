import useFetch from '../../hooks/useFetch';
import { useUserContext } from '../../hooks/UserContext';
import { useUnitContext } from '../../hooks/UnitContext';
import LoadingSpinner from '../Misc/LoadingSpinner/LoadingSpinner';
import Error from '../Misc/Error/Error';
import styles from '../Routines/RoutineExercise.module.css';
import workoutStyles from './WorkoutExercise.module.css';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashCan, faRotate, faRotateLeft, faInfoCircle, faCheck } from '@fortawesome/free-solid-svg-icons';
import DropdownButton from '../Misc/DropdownButton/DropdownButton';
import Modal from '../Misc/Modal/Modal';
import ModalFooter from '../Misc/Modal/ModalFooter';
import modalStyles from '../Misc/Modal/Modal.module.css';
import { calc1RM, convertToLbs } from '../../utils/utils';

export default function WorkoutExercise({ 
    id, 
    index, 
    exercises, 
    setExercises, 
    selectedExercise, 
    toggleSelected, 
    replace, 
    openDeleteModal,
    setInfo,
    addDeletedSet
 }) {
    const { user } = useUserContext();
    const [unit] = useUnitContext();
    const [exercise, loading, error]  = useFetch(user && id && `/users/${user?.id}/exercises/${id}/name`);

    const [deleteModal, setDeleteModal] = useState(false);
    const [removeSet, setRemoveSet] = useState(null);

    const handleChange = (e, setIndex) => {
        setExercises(exercises.map((el, elIndex) => {
            if (index === elIndex) {
                el[1] = el[1].map((s, sIndex) => {
                    if (setIndex === sIndex) {
                        if (s.completed) s = { ...s, completed: !s.completed };
                        if (e.target.name === "weight") {
                            s = { ...s, weight: Number(e.target.value) };
                        } else if (e.target.name === "reps") {
                            s = { ...s, reps: Number(e.target.value) };
                        }
                        s = { ...s, "1RM": calc1RM(s.weight, s.reps) };
                    }
                    return s;
                });
            }
            return el;
        }));
    };

    const deleteSet = setIndex => {
        // remove set from db if already in db
        if (exercises[index][1][setIndex].id) {
            addDeletedSet(exercises[index][1][setIndex].id);
        }

        setExercises(exercises.map((el, elIndex) => {
            if (index === elIndex) {
                el[1] = el[1].filter((s, sIndex) => {
                    return sIndex !== setIndex;
                });
            }
            return el;
        }));
    };

    const addSet = () => { 
        setExercises(exercises.map((el, elIndex) => {
            if (index === elIndex) {
                el[1] = [...el[1], { id: 0, weight: 0, reps: 0, completed: false }];
            }
            return el;
        }));
    };

    const completeSet = setIndex => {
        setExercises(exercises.map((el, elIndex) => {
            if (index === elIndex) {
                let set = el[1][setIndex];
                set = {
                    ...set,
                    completed: !set.completed
                };

                if (set.completed) {
                    if (!set.reps && set.placeholder?.reps) {
                        set.reps = set.placeholder.reps;
                    }
                    if (!set.weight && set.placeholder?.weight) {
                        set.weight = unit?.unit === "lbs" ? convertToLbs(set.placeholder.weight) : set.placeholder.weight;
                    }

                    set["1RM"] = calc1RM(set.weight, set.reps);
                }
                return [el[0], el[1].with(setIndex, set)];
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
                                    onClick={() => setInfo({
                                        name: exercise.name,
                                        id,
                                        userId: exercise.user_id
                                    })}
                                        
                                >
                                    <FontAwesomeIcon style={{color: 'var(--primary)'}} icon={faInfoCircle}/>
                                    <span>Info</span>
                                </button>

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

                    <div className={`${styles.sets} ${workoutStyles.sets}`}>
                        <div className={styles["sets-heading"]}>Set</div>
                        <div className={styles["sets-heading"]}>{unit?.unit === "lbs" ? 'lbs' : 'kg'}</div>
                        <div className={styles["sets-heading"]}>Reps</div>
                        <div></div>
                        <div></div>

                        {exercises[index][1].map((set, setIndex) => (
                            <React.Fragment key={setIndex}>
                                <div>{setIndex + 1}</div>

                                <input 
                                    min="0" 
                                    name="weight" 
                                    type="number" 
                                    step=".05"
                                    value={set.weight ? set.weight : ''}
                                    placeholder={set?.placeholder?.weight ? unit?.unit === "lbs" ? convertToLbs(set.placeholder.weight) : set.placeholder.weight : ''} 
                                    onChange={e => handleChange(e, setIndex)} 
                                />

                                <input 
                                    min="1" 
                                    name="reps" 
                                    type="number" 
                                    value={set.reps ? set.reps : ''}
                                    placeholder={set?.placeholder?.reps ? set.placeholder.reps : ''} 
                                    onChange={e => handleChange(e, setIndex)} 
                                />

                                <button 
                                    type="button"
                                    className={set.completed ? "button button-success" : "button button tertiary"}
                                    onClick={() => completeSet(setIndex)}
                                    disabled={!set?.placeholder?.reps && !set.reps}
                                >
                                    <FontAwesomeIcon icon={faCheck} />
                                </button>

                                <button 
                                    type="button"
                                    className="button button-tertiary"
                                    onClick={() => {
                                        if (!set.reps && !set.weight) {
                                            deleteSet(setIndex);
                                        } else {
                                            setRemoveSet({
                                                index: setIndex,
                                                weight: set.weight,
                                                reps: set.reps
                                            });
                                            setDeleteModal(true);
                                        }
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrashCan} />
                                </button>
                            </React.Fragment>
                        ))}
                    
                        <button 
                            type="button" 
                            className="button button-tertiary"
                            onClick={addSet}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            <span>Add Set</span>
                        </button>
                    </div>


                </>
            )}

            <Modal 
                openModal={deleteModal} 
                closeModal={() => setDeleteModal(false)} 
                title="Delete Set?"
            >
                <p>
                    Are you sure you want to delete set with data&nbsp;
                    {removeSet?.weight ? `${removeSet.weight}kg` : '0kg'} x {removeSet?.reps ? removeSet.reps : 0}.
                    This process can't be undone.
                </p>

                <ModalFooter>
                    <div className={modalStyles["button-container"]}>
                        <button 
                            type="button" 
                            onClick={() => setDeleteModal(false)} 
                            className="button button-tertiary"
                        >
                            Cancel
                        </button>
                        <button 
                            type="button"
                            className="button button-danger" 
                            onClick={() => {
                                deleteSet(removeSet.index);
                                setDeleteModal(false);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </ModalFooter>
            </Modal>
        </div>
    );
}