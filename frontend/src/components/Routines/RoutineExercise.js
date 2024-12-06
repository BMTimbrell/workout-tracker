import useFetch from '../../hooks/useFetch';
import { useUserContext } from '../../hooks/UserContext';
import { useUnitContext } from '../../hooks/UnitContext';
import LoadingSpinner from '../Misc/LoadingSpinner/LoadingSpinner';
import Error from '../Misc/Error/Error';
import styles from './RoutineExercise.module.css';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashCan, faRotate, faRotateLeft, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import DropdownButton from '../Misc/DropdownButton/DropdownButton';
import Modal from '../Misc/Modal/Modal';
import ModalFooter from '../Misc/Modal/ModalFooter';
import modalStyles from '../Misc/Modal/Modal.module.css';

export default function RoutineExercise({ 
    id, 
    index, 
    exercises, 
    setExercises, 
    selectedExercise, 
    toggleSelected, 
    replace, 
    openDeleteModal,
    addDeletedSet,
    setInfo
 }) {
    const { user } = useUserContext();
    const [unit] = useUnitContext();
    const [exercise, loading, error]  = useFetch(user && id && `/users/${user?.id}/exercises/${id}/name`);

    const [deleteModal, setDeleteModal] = useState(false);
    const [removeSet, setRemoveSet] = useState(false);

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
                el[1] = [...el[1], { id: 0, weight: 0, reps: 0 }];
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

                    <div className={styles.sets}>
                        <div className={styles["sets-heading"]}>Set</div>
                        <div className={styles["sets-heading"]}>{unit?.unit === "lbs" ? 'lbs' : 'kg'}</div>
                        <div className={styles["sets-heading"]}>Reps</div>
                        <div></div>

                        {exercises[index][1].map((set, setIndex) => (
                            <React.Fragment key={setIndex}>
                                <div>{setIndex + 1}</div>
                                <input 
                                    min="0" 
                                    name="weight" 
                                    type="number" 
                                    value={set.weight ? set.weight : ''} 
                                    onChange={e => handleChange(e, setIndex)} 
                                    step=".05"
                                />
                                <input 
                                    min="1" 
                                    name="reps" 
                                    type="number" 
                                    value={set.reps ? set.reps : ''} 
                                    onChange={e => handleChange(e, setIndex)} 
                                />
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
                            <button type="button" onClick={() => setDeleteModal(false)} className="button button-tertiary">
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