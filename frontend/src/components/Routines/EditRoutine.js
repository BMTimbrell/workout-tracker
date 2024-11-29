import ModalFooter from '../Misc/Modal/ModalFooter';
import { useState, useEffect, useRef } from 'react';
import { useUserContext } from '../../hooks/UserContext';
import { useUnitContext } from '../../hooks/UnitContext';
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

export default function EditRoutine({ closeModal, setFooter, updateRoutines, formData, setFormData, onClose }) {
    const { user } = useUserContext();
    const [unit] = useUnitContext();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const didMount = useRef(false);
    const [changesMade, setChangesMade] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();

        setSubmitting(true);

        const response = await editRoutine(
            user?.id, 
            formData.id, 
            formData.name, 
            [...JSON.parse(JSON.stringify(formData)).exercises], 
            formData.setsToDelete,
            unit?.units
        );
        
        if (response) {
            setError(false);
            setFormData({
                id: 0,
                name: "",
                exercises: [],
                setsToDelete: []
            });
            updateRoutines();
            closeModal();
        } else {
            setError(true);
        }

        setSubmitting(false);
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

                <div className={modalStyles["button-container2"]}>
                    <button 
                        className="button button-tertiary" 
                        onClick={() => closeModal()}
                    >
                        Cancel
                    </button>
                    <button 
                        form="editRoutineForm" 
                        type="submit" 
                        className="button button-primary" 
                        disabled={(!formData.name || submitting || !changesMade) && true}
                    >
                        {!submitting ? 'Save' : 'Saving...'}
                    </button>
                </div>

            </ModalFooter>
        );
        // eslint-disable-next-line
    }, [formData.name, submitting, changesMade]);

    useEffect(() => {
        if (onClose) {
            setError(false);
            updateRoutines();
            setChangesMade(false);
            didMount.current = false;
        }
    }, [onClose, updateRoutines]);

    useEffect(() => {
        setDeleteError(false);
    }, [deleteModal]);

    useEffect(() => {
        
        if (didMount.current) {
            setChangesMade(true);
        } else if (formData.id) {
            didMount.current = true;
        }
    }, [formData, formData.id]);
    
    return (
        <>
            <RoutineForm 
                handleSubmit={handleSubmit} 
                formData={formData} 
                error={error} 
                setFormData={setFormData}
                isEdit={true}
            />

            <Modal 
                openModal={deleteModal} 
                closeModal={() => setDeleteModal(false)} 
                title="Delete Routine?"
            >
                <p>Are you sure you want to delete "{formData.name}"? This process can't be undone.</p>
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