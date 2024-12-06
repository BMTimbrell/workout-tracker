import ModalFooter from './ModalFooter';
import { useState, useEffect, useRef } from 'react';
import { useUserContext } from '../../../hooks/UserContext';
import { useUnitContext } from '../../../hooks/UnitContext';
import RoutineForm from '../../Routines/RoutineForm';
import WorkoutForm from '../../Workout/WorkoutForm';
import modalStyles from './Modal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import Error from '../Error/Error';
import errorStyles from '../Error/Error.module.css';

export default function EditModal({ 
    editFunction,
    deleteFunction,
    openModal,
    title, 
    closeModal, 
    updateFunction, 
    formData, 
    setFormData, 
    formId, 
    onClose,
    formComponent 
}) {
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

        const response = await editFunction(
            user?.id, 
            formData.id, 
            formData.name, 
            [...JSON.parse(JSON.stringify(formData)).exercises], 
            formData.setsToDelete,
            unit?.unit
        );


        if (response?.authorisationFailed) {
            navigate('/logout');
        } else if (response) {
            setError(false);
            setFormData({
                id: 0,
                name: "",
                exercises: [],
                setsToDelete: []
            });
            updateFunction();
            closeModal();
        } else {
            setError(true);
        }

        setSubmitting(false);
    };

    const handleDelete = async () => {
        setDeleting(true);
        const response = await deleteFunction(user?.id, formData.id);
        
        if (response?.authorisationFailed) {
            navigate('/logout');
        } else if (response) {
            setError(false);
            setDeleteError(false);
            updateFunction();
            setDeleteModal(false);
            closeModal();
        } else {
            setDeleteError(true);
        }

        setDeleting(false);
    };

    useEffect(() => {
        if (onClose) {
            setError(false);
            updateFunction();
            setChangesMade(false);
            didMount.current = false;
        }
    }, [onClose, updateFunction]);

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
            <Modal
                openModal={openModal}
                closeModal={closeModal}
                title={title}
            >
                {formComponent === "routine" ? <RoutineForm 
                    handleSubmit={handleSubmit} 
                    formData={formData} 
                    error={error} 
                    setFormData={setFormData}
                    isEdit={true}
                /> : 
                <WorkoutForm
                    handleSubmit={handleSubmit} 
                    formData={formData} 
                    error={error} 
                    setFormData={setFormData}
                    isEdit={true}
                />}

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
                            form={formId}
                            type="submit" 
                            className="button button-primary" 
                            disabled={(!formData.name || submitting || !changesMade) && true}
                        >
                            {!submitting ? 'Save' : 'Saving...'}
                        </button>
                    </div>
                </ModalFooter>
            </Modal>

            <Modal 
                openModal={deleteModal} 
                closeModal={() => setDeleteModal(false)} 
                title="Delete Routine?"
            >
                <p>Are you sure you want to delete "{formData.name}"? This process can't be undone.</p>
                {deleteError && <Error style={errorStyles["margin"]} text={`Failed to remove ${formComponent} from database`}  />}
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