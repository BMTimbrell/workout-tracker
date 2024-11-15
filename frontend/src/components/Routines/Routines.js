import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Routines.module.css';
import Modal from '../Misc/Modal/Modal';
import { useState, useEffect, useCallback } from 'react';
import { getRoutines } from '../../api/api';
import { useUserContext } from '../../hooks/UserContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../Misc/LoadingSpinner/LoadingSpinner';
import Error from '../Misc/Error/Error';
import AddRoutine from './AddRoutine';
import Routine from './Routine';
import EditRoutine from './EditRoutine';

export default function Routines() {
    const { user } = useUserContext();
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [routines, setRoutines] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [addRoutineFooter, setAddRoutineFooter] = useState(null);
    const [editRoutineFooter, setEditRoutineFooter] = useState(null);
    const [selectedRoutine, setSelectedRoutine] = useState({
        id: 0,
        name: "",
        exercises: []
    });

    const updateRoutines = useCallback(async () => {
        setLoading(true);
        const controller = new AbortController();

        const response = await getRoutines(user?.id, controller);

        if (response?.authorisationFailed) {
            navigate('/logout');
        } else if (response?.abortError) {
            setError(false);
        } else if (response) {
            setError(false);
            setRoutines(response.routines);
        } else {
            setError(true);
        }

        setLoading(false);
    }, [navigate, user?.id]);

    useEffect(() => {
        updateRoutines();
    }, [updateRoutines]);

    return (
        <section>
            <div className={styles["heading-container"]}>
                <h2>Routines</h2>
                <button className="button button-primary" onClick={() => setAddModal(true)}>
                    <FontAwesomeIcon icon={faPlus} /> 
                </button>

            </div>

            {loading ? <LoadingSpinner /> : error ? <Error text="Failed to load data" /> : undefined}

            {routines?.length === 0 ? <p className={styles["new-routine"]}>You currently have no routines - 
                <button className="link-button" onClick={() => setAddModal(true)}>
                    Click here
                </button> to add a new routine.</p> : (
                <div className={styles.container}>
                    {routines && !loading && routines.map((routine, index) => (
                        <Routine 
                            key={index} 
                            routine={routine} 
                            openModal={() => setEditModal(true)} 
                            setSelectedRoutine={setSelectedRoutine} 
                        />
                    ))}
                </div>
            )}

            <Modal 
                openModal={addModal} 
                closeModal={() => setAddModal(false)} 
                title="Add Routine"
                footer={addRoutineFooter}
            >
                <AddRoutine closeModal={() => setAddModal(false)} setFooter={setAddRoutineFooter} updateRoutines={updateRoutines} />
            </Modal>

            <Modal 
                openModal={editModal} 
                closeModal={() => setEditModal(false)} 
                title="Edit Routine"
                footer={editRoutineFooter}
            >
                <EditRoutine 
                    closeModal={() => setEditModal(false)} 
                    setFooter={setEditRoutineFooter} 
                    updateRoutines={updateRoutines} 
                    formData={selectedRoutine}
                    setFormData={setSelectedRoutine}
                />
            </Modal>
        </section>
    );
}