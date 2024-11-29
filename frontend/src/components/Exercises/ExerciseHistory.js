import useFetch from '../../hooks/useFetch';
import { useUserContext } from '../../hooks/UserContext';
import { useUnitContext } from '../../hooks/UnitContext';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../Misc/LoadingSpinner/LoadingSpinner';
import Error from '../Misc/Error/Error';
import styles from './ExerciseHistory.module.css';
import Moment from 'react-moment';
import DatePicker from '../Misc/DatePicker/DatePicker';
import { formatDate } from '../../utils/utils';
import { convertToLbs } from '../../utils/utils';

export default function ExerciseHistory({ id, tabPanelRef }) {
    const { user } = useUserContext();
    const [data, loading, error]  = useFetch(user && id && `/users/${user?.id}/exercises/${id}/workouts/sets`);
    const navigate = useNavigate();

    useEffect(() => {
        if (data?.authorizationFailed) {
            navigate('/logout');
        }
    }, [data, navigate]);

    return (
        <>
            {data?.workouts.length && !loading && !error ? (
                <>
                    {!loading && !error && 
                        <DatePicker 
                            dates={data.workouts.map(workout => new Date(workout.date))}
                            scrollElement={tabPanelRef?.current}     
                        />
                    }

                    {data.workouts.map(workout => (
                        <div 
                            className={styles.workout} 
                            key={workout.id} 
                            data-date={formatDate(new Date(workout.date))}
                        >
                            <h3>{workout.name}</h3>

                            <ExerciseSets title="Sets" sets={workout.sets} />
                            
                            <Moment local format="HH:mm, dddd, Do MMM YYYY">
                                {workout.date}
                            </Moment>
                        </div>
                    ))}
                </>
            ) : loading ? <LoadingSpinner /> : error ? <Error text="Failed to load data" /> : (
                <p>
                    Previous performances of this exercise will display here - check back later!
                </p>
            )}


        </>
    );
}

export function ExerciseSets({ title, sets }) {
    const [unit] = useUnitContext();

    return (
        <div className={styles.sets}>
            <div className={styles["set-heading"]}>{title}</div>
            <div className={styles["set-heading"]}>1RM</div>
            {sets.map((set, index) => (
                <React.Fragment key={index}>
                    <div>
                        <span className={styles["set-number"]}>{index + 1}</span>
                        {unit?.unit === "lbs" ? convertToLbs(set.weight) : set.weight}
                        {unit?.unit === "lbs" ? 'lbs' : 'kg'} x {set.reps}
                    </div>
                    <div>
                    {unit?.unit === "lbs" ? convertToLbs(set.one_rep_max) : set.one_rep_max}
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}