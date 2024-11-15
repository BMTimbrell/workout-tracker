import ModalFooter from '../Misc/Modal/ModalFooter';
import { useState, useEffect } from 'react';
import { useUserContext } from '../../hooks/UserContext';
import RoutineForm from './RoutineForm';
import modalStyles from '../Misc/Modal/Modal.module.css';
import { editRoutine } from '../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Modal from '../Misc/Modal/Modal';
import Error from '../Misc/Error/Error';
import errorStyles from '../Misc/Error/Error.module.css';
import { deleteRoutine } from '../../api/api';

export default function EditRoutine({ closeModal, setFooter, updateRoutines, formData, setFormData }) {
    const { user } = useUserContext();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        // setSubmitting(true);
        
        // const response = await addRoutine(user?.id, formData.name, formData.exercises);
        
        // if (response) {
        //     setError(false);
        //     setFormData({
        //         name: "",
        //         exercises: []
        //     });
        //     updateRoutines();
        //     closeModal();
        // } else {
        //     setError(true);
        // }

        // setSubmitting(false);
    };

    const handleDelete = async () => {
        setDeleting(true);
        const response = await deleteRoutine(user?.id, formData.id);
        
        if (response?.authorisationFailed) {
            navigate('/logout');
        } else if (response) {
            setError(false);
            setDeleteError(false);
            updateRoutines();
            setDeleteModal(false);
            closeModal();
        } else {
            setDeleteError(true);
        }

        setDeleting(false);
    };

    useEffect(() => {
        setFooter(
            <ModalFooter>
                <button 
                    className="button button-danger" 
                    onClick={() => setDeleteModal(true)}
                    disabled={submitting && true}
                >
                    <FontAwesomeIcon icon={faTrashCan} />
                    <span>Delete</span>
                </button>

                <div className={modalStyles["button-container"]}>
                    <button 
                        className="button button-tertiary" 
                        onClick={() => {
                            setFormData({
                                name: "",
                                exercises: []
                            });
                            setError(false);
                            closeModal();
                        }}
                    >
                        Close
                    </button>
                    <button 
                        form="addRoutineForm" 
                        type="submit" 
                        className="button button-primary" 
                        disabled={(!formData.name || submitting) && true}
                    >
                        {!submitting ? 'Save' : 'Saving...'}
                    </button>
                </div>

            </ModalFooter>
        );
        // eslint-disable-next-line
    }, [formData.name, submitting]);

    useEffect(() => {
        setError(false);
    }, [closeModal]);

    useEffect(() => {
        setDeleteError(false);
    }, [deleteModal]);
    
    return (
        <>
            <RoutineForm 
                handleSubmit={handleSubmit} 
                formData={formData} 
                error={error} 
                setFormData={setFormData} 
            />

            <Modal 
                openModal={deleteModal} 
                closeModal={() => setDeleteModal(false)} 
                title="Delete Routine?"
            >
                <p style={{padding: "1rem"}}>Are you sure you want to delete "{formData.name}"? This process can't be undone.</p>
                {deleteError && <Error style={errorStyles["margin"]} text="Failed to remove routine from database"  />}
                <ModalFooter>
                    <div className={modalStyles["button-container"]}>
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