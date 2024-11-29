import ModalFooter from '../Misc/Modal/ModalFooter';
import { useState, useEffect } from 'react';
import { useUserContext } from '../../hooks/UserContext';
import { useUnitContext } from '../../hooks/UnitContext';
import RoutineForm from './RoutineForm';
import modalStyles from '../Misc/Modal/Modal.module.css';
import { addRoutine } from '../../api/api';
import { useNavigate } from 'react-router-dom';

export default function AddRoutine({ closeModal, setFooter, updateRoutines, onClose }) {
    const [formData, setFormData] = useState({
        name: "",
        exercises: []
    });

    const { user } = useUserContext();
    const [unit] = useUnitContext();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        setSubmitting(true);

        const response = await addRoutine(
            user?.id, 
            formData.name, 
            formData.exercises, 
            unit?.unit
        );
        
        if (response?.authorisationFailed) {
            navigate('/logout');
        } else if (response) {
            setError(false);
            setFormData({
                name: "",
                exercises: []
            });
            updateRoutines();
            closeModal();
        } else {
            setError(true);
        }

        setSubmitting(false);
    };

    useEffect(() => {
        setFooter(
            <ModalFooter>
                <div className={modalStyles["button-container"]}>
                    <button 
                        className="button button-tertiary" 
                        onClick={() => closeModal()}
                    >
                        Cancel
                    </button>
                    <button 
                        form="addRoutineForm" 
                        type="submit" 
                        className="button button-primary" 
                        disabled={(!formData.name || submitting) && true}
                    >
                        {!submitting ? 'Add' : 'Adding...'}
                    </button>
                </div>
            </ModalFooter>
        );
        // eslint-disable-next-line
    }, [formData.name, submitting]);

    useEffect(() => {
        if (onClose) {
            setFormData({
                name: "",
                exercises: []
            });
            setError(false);
        }
    }, [onClose]);
    
    return (
        <>
            <RoutineForm 
                handleSubmit={handleSubmit} 
                formData={formData} 
                error={error} 
                setFormData={setFormData} 
            />
        </>
    );
}