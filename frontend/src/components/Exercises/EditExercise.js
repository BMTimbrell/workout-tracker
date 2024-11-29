import ModalFooter from '../Misc/Modal/ModalFooter';
import Modal from '../Misc/Modal/Modal';
import modalStyles from '../Misc/Modal/Modal.module.css';
import styles from './Exercises.module.css';
import Select from '../Misc/Select/Select';
import Error from '../Misc/Error/Error';
import errorStyles from '../Misc/Error/Error.module.css';
import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../hooks/UserContext';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { editExercise, deleteExercise, getNumberRoutinesByExercise, getNumberWorkoutsByExercise } from '../../api/api';
import { useNavigate } from 'react-router-dom';

export default function EditExercise({ formData, setFormData, closeModal, bodyparts, updateExercises }) {
    const { user } = useUserContext();
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => {
        if (e.target.id === "name") {
            setFormData(prev => ({
                ...prev,
                name: e.target.value
            }));
        } else if (e.target.id === "bodypart") {
            setFormData(prev => ({
                ...prev,
                bodypart: e.target.value
            }));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setSubmitting(true);
        const response = await editExercise(user?.id, formData.id, formData.name, formData.bodypart);
        
        if (response?.authorizationFailed) {
            navigate('/logout');
        } else if (response) {
            setError(false);
            updateExercises();
            closeModal();
        } else {
            setError(true);
        }

        setSubmitting(false);
    };

    const handleDelete = async () => {
        setDeleting(true);

        const routineResponse = await getNumberRoutinesByExercise(user?.id, formData.id);
        const workoutResponse = await getNumberWorkoutsByExercise(user?.id, formData.id);
        
        if (routineResponse?.authorisationFailed || workoutResponse?.authorisationFailed) {
            navigate('/logout');
        } else if (routineResponse?.count > 0 || workoutResponse?.count > 0) {
            const rCount = parseInt(routineResponse?.count);
            const wCount = parseInt(workoutResponse?.count);

            const routinesText = !rCount ? '' : rCount > 1 ? `${rCount} routines` : `${rCount} routine`
            const workoutsText = !wCount ? '' : wCount > 1 ? `${wCount} workouts` : `${wCount} workout`
            const andText = routinesText && workoutsText ? ' and ' : '';

            const entriesText = (wCount && rCount) || (rCount > 1 || wCount > 1) ? 'these entries' : 'this entry';

            setDeleteError(
                `You have ${routinesText}${andText}${workoutsText} containing this exercise. You must remove ${entriesText} before you can delete this exercise.`
            );
            setDeleting(false);
            return;
        } else if (!routineResponse || !workoutResponse) {
            setDeleting(false);
            setDeleteError('Failed to delete exercise.');
            return;
        }

        const deleteResponse = await deleteExercise(user?.id, formData.id);
        
        if (deleteResponse?.authorisationFailed) {
            navigate('/logout');
        } else if (deleteResponse) {
            setError(false);
            setDeleteError('');
            updateExercises();
            setDeleteModal(false);
            closeModal();
        } else {
            setDeleteError('Failed to delete exercise.');
        }

        setDeleting(false);
    };

    useEffect(() => {
        setError(false);
    }, [closeModal]);

    useEffect(() => {
        setDeleteError(false);
    }, [deleteModal]);

    return (
        <>
            <form id="editExerciseForm" className="form" onSubmit={handleSubmit}>
                <div className="input-container">
                    <div className="floating-input">
                        <input 
                            id="name"
                            type="text"
                            onChange={handleChange} 
                            value={formData.name} 
                            placeholder=" " 
                            required 
                        />
                        <label htmlFor="name">Name</label>
                    </div>

                    <div className="floating-input">
                        <Select id="bodypart" value={formData.bodypart} onChange={handleChange}>
                            {bodyparts && bodyparts?.bodyparts.map(el => (
    
                                    <option value={el} key={el}>{el}</option>
                            ))}
                            <option value="Other">Other</option>
                        </Select>
                        <label htmlFor="name">Body part</label>
                    </div>

                    {error && <Error style={errorStyles['form-error']} text="Failed to update exercise"  />}

                </div>
                
            </form>

            <ModalFooter>
                <button 
                    className="button button-danger" 
                    onClick={() => setDeleteModal(true)}
                    disabled={submitting && true}
                >
                    <FontAwesomeIcon icon={faTrashCan} />
                    <span>Delete</span>
                </button>
                <div className={modalStyles["button-container2"]}>
                    <button onClick={closeModal} className="button button-tertiary">Cancel</button>
                    <button 
                        type="submit" 
                        className="button button-primary" 
                        form="editExerciseForm"
                        disabled={submitting && true}
                    >
                        {!submitting ? 'Save' : 'Saving...'}
                    </button>
                </div>
            </ModalFooter>

            <Modal 
                openModal={deleteModal} 
                closeModal={() => setDeleteModal(false)} 
                title="Delete Exercise?"
            >
                <p>Are you sure you want to delete "{formData.name}"? This process can't be undone.</p>
                {deleteError && <Error style={errorStyles["margin"]} text={deleteError}  />}
                <ModalFooter>
                    <div className={styles["button-container"]}>
                        <button onClick={() => setDeleteModal(false)} className="button button-tertiary">Cancel</button>
                        <button 
                            className="button button-danger" 
                            disabled={deleting && true}
                            onClick={handleDelete}
                        >
                            {!deleting ? 'Delete' : 'Deleting...'}
                        </button>
                    </div>
                </ModalFooter>
            </Modal>
        </>
    );
}