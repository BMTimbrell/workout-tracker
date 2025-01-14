import Select from '../Misc/Select/Select';
import { useUserContext } from '../../hooks/UserContext';
import { useUnitContext } from '../../hooks/UnitContext';
import useFetch from '../../hooks/useFetch';
import LoadingSpinner from '../Misc/LoadingSpinner/LoadingSpinner';
import Error from '../Misc/Error/Error';
import styles from './Profile.module.css';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import Modal from '../Misc/Modal/Modal';
import EditName from './EditName';
import EditEmail from './EditEmail';
import EditPassword from './EditPassword';

export default function Profile() {
    const { user } = useUserContext();
    const [userData, loading, error, setUserData] = useFetch(user?.id && `/users/${user?.id}`);
    const [unit, setUnit] = useUnitContext();

    const [editNameModal, setEditNameModal] = useState(false);
    const [name, setName] = useState(userData?.name || "");
    const [editEmailModal, setEditEmailModal] = useState(false);
    const [email, setEmail] = useState(userData?.email || "");
    const [editPasswordModal, setEditPasswordModal] = useState(false);

    const handleSelectChange = e => {
        setUnit({
            unit: e.target.value
        });
    };

    const closeNameModal = () => {
        setEditNameModal(false);
        setName(userData.name);
    };

    const closeEmailModal = () => {
        setEditEmailModal(false);
        setEmail(userData.email);
    };

    useEffect(() => {
        if (userData) {
            setName(userData.name);
            setEmail(userData.email);
        }
    }, [userData]);

    return (
        <>
            <h1>Profile</h1>

            <div className={styles.container}>
                {userData && !loading && !error ? (
                    <>  
                        <div className={styles["user-info-container"]}>
                            <div className={styles["user-info"]}>{userData.name}</div>
                            <button className="button button-secondary" onClick={() => setEditNameModal(true)}>
                                <FontAwesomeIcon icon={faPencil} />
                            </button>
                        </div>
                        <div className={styles["user-info-container"]}>
                        <div className={styles["user-info"]}>{userData.email}</div>
                            <button className="button button-secondary" onClick={() => setEditEmailModal(true)}>
                                <FontAwesomeIcon icon={faPencil} />
                            </button>
                        </div>
                    </>
                ) : loading ? <LoadingSpinner /> : <Error text="Failed to load data." />}

                <div className="floating-input">
                    <Select id="unit" value={unit?.unit === "lbs" ? "lbs" : "kg"} onChange={handleSelectChange}>
                        <option value="kg">kg</option>
                        <option value="lbs">lbs</option>
                    </Select>
                    <label htmlFor="unit">Weight unit</label>
                </div>

                <button className="link-button" onClick={() => setEditPasswordModal(true)}>Change password</button>
            </div>
            

            <Modal openModal={editNameModal} closeModal={closeNameModal} title="Change Your Name">
                <EditName 
                    name={name} 
                    setName={setName}
                    setUserData={setUserData} 
                    closeModal={closeNameModal}
                />
            </Modal>

            <Modal openModal={editEmailModal} closeModal={closeEmailModal} title="Change Your Email">
                <EditEmail
                    email={email}
                    setEmail={setEmail}
                    closeModal={closeEmailModal}
                    setUserData={setUserData}
                />
            </Modal>

            <Modal openModal={editPasswordModal} closeModal={() => setEditPasswordModal(false)} title="Change Your Password">
                <EditPassword
                    closeModal={() => setEditPasswordModal(false)}
                />
            </Modal>
        </>
    );
}