import ModalFooter from '../Misc/Modal/ModalFooter';
import modalStyles from '../Misc/Modal/Modal.module.css';
import Error from '../Misc/Error/Error';
import errorStyles from '../Misc/Error/Error.module.css';
import { useState, useEffect } from 'react';
import { updatePassword } from '../../api/api';
import { useUserContext } from '../../hooks/UserContext';
import { useNavigate } from 'react-router-dom';

export default function EditPassword({ closeModal }) {
    const { user } = useUserContext();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        newPassword: '',
        reNewPassword: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = e => {
        switch (e.target.id) {
            case 'password':
                setFormData(prev => ({
                    ...prev,
                    password: e.target.value
                }));
                break;
            case 'newPassword':
                setFormData(prev => ({
                    ...prev,
                    newPassword: e.target.value
                }));
                break;
            case 'reNewPassword':
                setFormData(prev => ({
                    ...prev,
                    reNewPassword: e.target.value
                }));
                break;
            default: break;
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (formData.newPassword !== formData.reNewPassword) {
            setError("New password doesn't match re-entered one");
            return;
        }

        setSubmitting(true);
        const response = await updatePassword(user?.id, formData.password, formData.newPassword);
        setSubmitting(false);

        if (response?.authorisationFailed) {
            navigate('/logout');
        } else if (response?.error === 'invalid password') {
            setError('You must enter a valid password');
            return;
        } else if (response?.message === "password doesn't match") {
            setError("Password is incorrect");
        } else if (response) {
            closeModal();
        } else {
            setError('Failed to update password');
        }
    };

    useEffect(() => {
        setError('');
        setFormData({
            password: '',
            newPassword: '',
            reNewPassword: ''
        });
    }, [closeModal]);

    return (
        <>
            <form id="editPasswordForm" className="form" onSubmit={handleSubmit}>
                <div className="input-container">
                    <div className="floating-input">
                        <input 
                            id="password"
                            type="password" 
                            onChange={handleChange}
                            placeholder=" "
                            value={formData.password} 
                            required 
                        />
                        <label htmlFor="password">Current password</label>
                    </div>

                    <div className="floating-input">
                        <input 
                            id="newPassword"
                            type="password" 
                            onChange={handleChange}
                            placeholder=" "
                            value={formData.newPassword} 
                            required 
                        />
                        <label htmlFor="newPassword">New password</label>
                    </div>

                    <div className="floating-input">
                        <input 
                            id="reNewPassword"
                            type="password" 
                            onChange={handleChange}
                            placeholder=" "
                            value={formData.reNewPassword} 
                            required 
                        />
                        <label htmlFor="reNewPassword">Re-enter new password</label>
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
                        form="editPasswordForm"
                        disabled={submitting && true}
                    >
                        {!submitting ? 'Save' : 'Saving...'}
                    </button>
                </div>
            </ModalFooter>
        </>
    );
}