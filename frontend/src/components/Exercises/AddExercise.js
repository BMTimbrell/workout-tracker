import ModalFooter from '../Misc/Modal/ModalFooter';
import styles from './Exercise.module.css';
import Select from '../Misc/Select/Select';
import Error from '../Misc/Error/Error';
import errorStyles from '../Misc/Error/Error';
import { useState } from 'react';
import { addExercise } from '../../api/api';
import { useUserContext } from '../../hooks/UserContext';

export default function AddExercise({ closeModal, bodyparts, updateExercises }) {
    const [formData, setFormData] = useState({
        name: "",
        bodypart: "Other"
    });

    const { user } = useUserContext();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(false);

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
        const response = await addExercise(user?.id, formData.name, formData.bodypart);
        
        if (response) {
            setError(false);
            setFormData({
                name: "",
                bodypart: "Other"
            });
            e.target.reset();
            updateExercises();
            closeModal();
        } else {
            setError(true);
        }

        setSubmitting(false);
    };

    return (
        <>
            <form id="addExerciseForm" className="form" onSubmit={handleSubmit}>
                <div className="input-container">
                    <div className="floating-input">
                        <input 
                            id="name"
                            type="text"
                            onChange={handleChange} 
                            name="name" 
                            placeholder=" " 
                            required 
                        />
                        <label htmlFor="name">Name</label>
                    </div>

                    <div className="floating-input">
                        <Select id="bodypart" onChange={handleChange}>
                            {bodyparts && bodyparts?.bodyparts.map(el => (
                                <option key={el} value={el}>{el}</option>
                            ))}
                            <option value="Other">Other</option>
                        </Select>
                        <label htmlFor="name">Body part</label>
                    </div>

                    {error && <Error style={errorStyles['form-error']} text="Submission failed"  />}
                </div>
                
            </form>

            <ModalFooter>
                <div className={styles["button-container"]}>
                    <button onClick={closeModal} className="button button-tertiary">Cancel</button>
                    <button 
                        type="submit" 
                        className="button button-primary" 
                        form="addExerciseForm"
                        disabled={submitting && true}
                    >
                        {!submitting ? 'Add' : 'Adding...'}
                    </button>
                </div>
            </ModalFooter>
        </>
    );
}