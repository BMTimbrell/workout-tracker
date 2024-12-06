import { useUserContext } from '../../hooks/UserContext';
import { useUnitContext } from '../../hooks/UnitContext';
import { Link, useNavigate } from 'react-router-dom';
import Routines from '../Routines/Routines';
import styles from './Home.module.css';
import QuickStart from '../QuickStart/QuickStart';
import useLocalStorage from '../../hooks/useLocalStorage';
import Workout from '../Workout/Workout';
import Error from '../Misc/Error/Error';
import Modal from '../Misc/Modal/Modal';
import modalStyles from '../Misc/Modal/Modal.module.css';
import ModalFooter from '../Misc/Modal/ModalFooter';
import { useState, useEffect } from 'react';
import { editRoutine } from '../../api/api';

export default function Home() {
    const { user } = useUserContext();
    const [unit] = useUnitContext();
    const [workout, setWorkout, removeWorkout] = useLocalStorage('workout');
    const [updateModal, setUpdateModal] = useState(false);
    const [routine, setRoutine] = useState(null);
    const [error, setError] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const confirmUpdate = async deleteSets => {
        setSubmitting(true);

        let response = null;

        if (deleteSets) {
            response = await editRoutine(
                user?.id, 
                routine.id, 
                "", 
                routine.exercises.filter(exercise =>
                    !exercise[1].some(set => set.id === routine.removedSets.find(s => s === set.id))
                ), 
                routine.removedSets,
                unit?.units
            );
         
        } else {
            response = await editRoutine(
                user?.id, 
                routine.id, 
                "", 
                routine.exercises, 
                [],
                unit?.units
            );
        }

        if (response?.authorisationFailed) {
            navigate('/logout');
        } else if (response) {
            setError(false);
            setUpdateModal(false);
        } else {
            setError(true);
        }

        setSubmitting(false);
    };

    useEffect(() => {
        if (!updateModal) {
            setError(false);
        }
    }, [updateModal]);

    if (!user) return (
        <>
            <h1>Start Workout</h1>

            <p className={styles.about}>
                This is an app for tracking workouts. You can create a workout template from a list of available, or user-made, exercises. <Link className="link" to="/login">Log in</Link> to use this app.
            </p>
        </>
    );

    return (
        <>
            <h1>Start Workout</h1>
            {workout && <Workout 
                workout={workout} 
                setWorkout={setWorkout} 
                removeWorkout={removeWorkout}
                setUpdateModal={setUpdateModal}
                setRoutine={setRoutine}
            />}
            <QuickStart workout={workout} setWorkout={setWorkout} />
            <Routines workout={workout} setWorkout={setWorkout} updateModal={updateModal} />

            <Modal 
                openModal={updateModal} 
                closeModal={() => setUpdateModal(false)} 
                title="Update Routine?"
            >
                {error && <p><Error text="Failed to update routine." /></p>}
                <ModalFooter>
                    <div className={modalStyles["button-container3"]}>
                        <button onClick={() => setUpdateModal(false)} className="button button-tertiary">
                            Keep Original Routine
                        </button>
                        <button 
                            className="button button-primary" 
                            onClick={() => confirmUpdate(false)}
                            disabled={submitting}
                        >
                            {!submitting ? 'Only Update Set Data' : 'Updating...'}
                        </button>
                        {routine?.removedSets.length > 0 && <button 
                            className="button button-danger" 
                            onClick={() => confirmUpdate(true)}
                            disabled={submitting}
                        >
                            {!submitting ? 'Update Routine and Delete Any Removed Sets and Exercises' : 'Updating...'}
                        </button>}
                    </div>
                </ModalFooter>
            </Modal>
        </>
    );
}