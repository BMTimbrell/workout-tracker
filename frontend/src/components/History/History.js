import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../hooks/UserContext';
import { getWorkouts } from '../../api/api';
import HistoryWorkout from './HistoryWorkout';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import styles from './History.module.css';
import Modal from '../Misc/Modal/Modal';
import ModalFooter from '../Misc/Modal/ModalFooter';
import LoadingSpinner from '../Misc/LoadingSpinner/LoadingSpinner';
import Error from '../Misc/Error/Error';

export default function History() {
    const { user } = useUserContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [workouts, setWorkouts] = useState(null);
    const [date, setDate] = useState(null);

    const [infoModal, setInfoModal] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState(null);

    const formatDate = date => {
        return date ? `${date.getFullYear()} ${date.getMonth()} ${date.getDate()}` : '';
    }

    const isWorkoutDate = date => {
        return workouts?.some(workout => 
            formatDate(new Date(workout.date)) === formatDate(new Date(date))
        );
    };

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

    useEffect(() => {
        const headerHeight = document.querySelector('header').offsetHeight;
        const workout = document.querySelector(`[data-date="${formatDate(date)}"]`)?.offsetTop;
        window.scrollTo({ top: workout - headerHeight, behavior: 'smooth' });
    }, [date]);

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

            <div className={styles["date-picker-container"]}>
                {!loading && !error && 
                    <DatePicker 
                        selected={date} 
                        onChange={date => setDate(date)} 
                        highlightDates={workouts?.map(workout => new Date(workout.date))}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select date"
                        maxDate={new Date()}
                        isClearable={true}
                        showYearDropdown
                        scrollableYearDropdown
                        filterDate={isWorkoutDate}
                    />
                }
            </div>

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
                    />
                ))}
            </div>

            <Modal 
                openModal={infoModal} 
                closeModal={() => setInfoModal(false)} 
                title=""
            >

                <ModalFooter>
                    <button className="button button-tertiary" onClick={() => setInfoModal(false)}>Close</button>
                </ModalFooter>
            </Modal>
        </>
    );
}