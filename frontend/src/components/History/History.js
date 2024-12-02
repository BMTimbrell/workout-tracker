import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../hooks/UserContext';
import { getWorkouts, editWorkout, deleteWorkout } from '../../api/api';
import HistoryWorkout from './HistoryWorkout';
import DatePicker from '../Misc/DatePicker/DatePicker';
import styles from './History.module.css';
import Modal from '../Misc/Modal/Modal';
import ModalFooter from '../Misc/Modal/ModalFooter';
import LoadingSpinner from '../Misc/LoadingSpinner/LoadingSpinner';
import Error from '../Misc/Error/Error';
import EditModal from '../Misc/Modal/EditModal';
import HistoryWorkoutInfo from './HistoryWorkoutInfo';
import Moment from 'react-moment';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

export default function History() {
    const { user } = useUserContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [workouts, setWorkouts] = useState(null);

    const [infoModal, setInfoModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState({
        id: 0,
        name: "",
        exercises: [],
        setsToDelete: []
    });

    const formatDate = date => {
        return date ? `${date.getFullYear()} ${date.getMonth()} ${date.getDate()}` : '';
    }

    const updateWorkouts = useCallback(async () => {
        setLoading(true);
        const controller = new AbortController();

        const response = await getWorkouts(user?.id, controller);

        if (response?.authorisationFailed) {
            navigate('/logout');
        } else if (response?.abortError) {
            setError(false);
        } else if (response) {
            setError(false);
            setWorkouts(response.workouts);
        } else {
            setError(true);
        }

        setLoading(false);
    }, [navigate, user?.id]);

    useEffect(() => {
        updateWorkouts();
    }, [updateWorkouts]);

    if (workouts?.length === 0) {
        return (
            <>
                <h1>History</h1>

                <p style={{textAlign: "center"}}>You haven't completed any workouts.</p>
            </>
        );
    }

    return (
        <>
            <h1>History</h1>

                    {!loading && !error && 
                        <DatePicker
                            dates={workouts?.map(workout => new Date(workout.date))}
                            offsetHeight={document?.querySelector('header')?.offsetHeight}
                        />
                    }


            {
                loading ? <LoadingSpinner /> : error ? <Error text="Failed to load data" /> : undefined
            }

            <div className={styles.container}>
                {workouts && !error && !loading && workouts.map(workout => (
                    <HistoryWorkout 
                        key={workout.id} 
                        workout={workout} 
                        formatDate={formatDate} 
                        openInfo={() => setInfoModal(true)}
                        openEdit={() => setEditModal(true)}
                        setSelectedWorkout={setSelectedWorkout}
                    />
                ))}
            </div>

            <Modal 
                openModal={infoModal} 
                closeModal={() => setInfoModal(false)} 
                title={selectedWorkout.name}
            >
                <HistoryWorkoutInfo 
                    exercises={selectedWorkout.exercises}
                />

                <ModalFooter>
                    <div className={styles["time-container"]}>
                        <Moment local format="HH:mm, ddd, Do MMM YYYY">
                            {selectedWorkout.date}
                        </Moment>
                        <time>
                            <FontAwesomeIcon icon={faClock}></FontAwesomeIcon>&nbsp;
                            {moment.duration(selectedWorkout.duration, "HH:mm:ss").format("h [hrs] m [min]") === "0 mins" ? 
                                moment.duration(selectedWorkout.duration, "HH:mm:ss").format("s [seconds]") : 
                                moment.duration(selectedWorkout.duration, "HH:mm:ss").format("h [hrs] m [min]")
                            }
                        </time>
                    </div>
                    <button className="button button-tertiary" onClick={() => setInfoModal(false)}>Close</button>
                </ModalFooter>
            </Modal>

            <EditModal
                openModal={editModal}
                closeModal={() => setEditModal(false)}
                title="Edit Workout"
                updateFunction={updateWorkouts}
                editFunction={editWorkout}
                deleteFunction={deleteWorkout}
                formData={selectedWorkout}
                setFormData={setSelectedWorkout}
                onClose={!editModal}
                formId="editWorkoutForm"
                formComponent={"workout"}
             />

        </>
    );
}