import ModalFooter from '../Misc/Modal/ModalFooter';
import modalStyles from '../Misc/Modal/Modal.module.css';
import { useState, useEffect } from 'react';
import { updateEmail } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../hooks/UserContext';
import Error from '../Misc/Error/Error';
import errorStyles from '../Misc/Error/Error.module.css';

export default function EditEmail({ closeModal, email, setEmail, setUserData }) {
    const { user } = useUserContext();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = e => {
        setEmail(e.target.value);
    };

    const handleSubmit = async e => {
        e.preventDefault();

        setSubmitting(true);
        const response = await updateEmail(user?.id, email);
        setSubmitting(false);
    
        if (response?.authorisationFailed) {
            navigate('/logout');
        } else if (response?.message === 'user already registered with this email') {
            setError('User already registered with this email');
            return;
        } else if (response?.error === 'invalid email') {
            setError('You must enter a valid email');
            return;
        } else if (response) {
            setUserData(prev => ({
                ...prev,
                email
            }));
            closeModal();
        } else {
            setError('Failed to update email');
        }
    };

    useEffect(() => {
        setError('');
    }, [closeModal]);

    return (
        <>
            <form className="form" id="editEmailForm" onSubmit={handleSubmit}>
                <div className="input-container">
                    <div className="floating-input">
                        <input 
                            id="email"
                            type="email" 
                            onChange={handleChange}
                            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" 
                            placeholder=" " 
                            required
                            value={email} 
                        />
                        <label htmlFor="email">New email</label>
                    </div>
                    {error && <Error style={errorStyles['form-error']} text={error} />}
                </div>
            </form>

            <ModalFooter>
                <div className={modalStyles["button-container"]}>
                    <button type="button" onClick={closeModal} className="button button-tertiary">
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="button button-primary" 
                        form="editEmailForm"
                        disabled={submitting && true}
                    >
                        {!submitting ? 'Save' : 'Saving...'}
                    </button>
                </div>
            </ModalFooter>
        </>
    );
}