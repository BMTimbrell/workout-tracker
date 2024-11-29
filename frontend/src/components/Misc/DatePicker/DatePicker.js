import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from 'react';
import styles from './DatePicker.module.css';
import { formatDate } from '../../../utils/utils';

export default function MyDatePicker({ dates, scrollElement = window, offsetHeight = 0 }) {
    const [date, setDate] = useState(null);

    const isWorkoutDate = d => {
        return dates?.some(date => 
            formatDate(date) === formatDate(d)
        );
    };

    useEffect(() => {
        const top = (scrollElement === window ? document : scrollElement)
            .querySelector(`[data-date="${formatDate(date)}"]`)?.offsetTop - offsetHeight;

        scrollElement.scrollTo({ 
            top,
            behavior: 'smooth' 
        });
    }, [date, offsetHeight, scrollElement]);

    return (
        <div className={styles["sticky-container"]}>
            <div className={styles["date-picker-container"]}>
                    <DatePicker 
                        selected={date} 
                        onChange={date => setDate(date)} 
                        highlightDates={dates}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select date"
                        maxDate={new Date()}
                        isClearable={true}
                        showYearDropdown
                        scrollableYearDropdown
                        filterDate={isWorkoutDate}
                    />
            </div>
        </div>
    );
}