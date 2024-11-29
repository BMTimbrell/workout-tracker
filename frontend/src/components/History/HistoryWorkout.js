import Moment from 'react-moment';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPencil, faInfo } from '@fortawesome/free-solid-svg-icons';
import styles from './HistoryWorkout.module.css';
import React from 'react';
import { useUnitContext } from '../../hooks/UnitContext';
import { convertToLbs } from '../../utils/utils';

export default function HistoryWorkout({ workout, formatDate, openInfo, openEdit, setSelectedWorkout }) {
    const [unit] = useUnitContext();

    return (
        <div className={styles.container} data-date={formatDate(new Date(workout.date))}>
            <div className={styles.header}>
                <h2>{workout.name}</h2>
                <div className={styles["button-container"]}>
                    <button className="button button-secondary" onClick={openInfo}>
                        <FontAwesomeIcon icon={faInfo}></FontAwesomeIcon>
                        </button>
                    <button className="button button-secondary" onClick={() => {
                        openEdit();
                        setSelectedWorkout({
                            id: workout.id,
                            name: workout.name,
                            exercises: workout.exercises[0] ? workout.exercises.map(exercise => {
                                return [
                                    exercise.id, 
                                    exercise.sets.map(set => {
                                        if (unit.unit === "lbs") {
                                            set.weight = convertToLbs(set.weight);
                                        }
                                        return set;
                                    })
                                ]
                            }) : [],
                            setsToDelete: []
                        });
                    }}>
                        <FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>
                    </button>
                </div>
            </div>

            <div className={styles.exercises}>
                <div className={styles["exercise-heading"]}>Exercise</div>
                <div className={styles["exercise-heading"]}>Best Set</div>

                {workout.exercises.map((exercise, index) =>
                    exercise?.sets.map(set => 
                        set.best_set && (
                            <React.Fragment key={set.id}>
                                <div>{workout.exercises[index].sets.length} x {exercise.name}</div>
                                <div>
                                    {unit?.unit === "lbs" ? convertToLbs(set.weight) : set.weight}
                                    {unit?.unit === "lbs" ? 'lbs' : 'kg'} x {set.reps}
                                </div>
                            </React.Fragment>
                        )
                    )
                )}
            </div>
            
            <div className={styles.footer}>
                <Moment local format="dddd, Do MMM YYYY">
                    {workout.date}
                </Moment>

                <div className={styles.time}>
                    <FontAwesomeIcon icon={faClock} />
                    <span>
                        {moment.duration(workout.duration, "HH:mm:ss").format("h [hrs] m [min]") === "0 mins" ? 
                            moment.duration("0:00:21", "HH:mm:ss").format("s [seconds]") : 
                            moment.duration(workout.duration, "HH:mm:ss").format("h [hrs] m [min]")
                        }
                    </span>
                </div>
            </div>
        </div>
    );
}