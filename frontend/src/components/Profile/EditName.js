import ModalFooter from '../Misc/Modal/ModalFooter';
import modalStyles from '../Misc/Modal/Modal.module.css';
import Error from '../Misc/Error/Error';
import errorStyles from '../Misc/Error/Error.module.css';
import { useState, useEffect } from 'react';
import { updateName } from '../../api/api';
import { useUserContext } from '../../hooks/UserContext';
import { useNavigate } from 'react-router-dom';

export default function EditName({ closeModal, name, setName, setUserData }) {
    const { user } = useUserContext();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = e => {
        setName(e.target.value);
    };

    const handleSubmit = async e => {
        e.preventDefault();

        setSubmitting(true);
        const response = await updateName(user?.id, name);
        setSubmitting(false);

        if (response?.authorisationFailed) {
            navigate('/logout');
        } else if (response?.error === 'invalid name') {
            setError('You must enter a valid name');
            return;
        } else if (response) {
            setUserData(prev => ({
                ...prev,
                name
            }));
            closeModal();
        } else {
            setError('Failed to update name');
        }
    };

    useEffect(() => {
        setError('');
    }, [closeModal]);

    return (
        <>
            <form id="editNameForm" className="form" onSubmit={handleSubmit}>
                <div className="input-container">
                    <div className="floating-input">
                        <input 
                            id="name"
                            type="text" 
                            onChange={handleChange}
                            placeholder=" " 
                            required
                            value={name} 
                        />
                        <label htmlFor="name">New name</label>
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
                        form="editNameForm"
                        disabled={submitting && true}
                    >
                        {!submitting ? 'Save' : 'Saving...'}
                    </button>
                </div>
            </ModalFooter>
        </>
    );
}