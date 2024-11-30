import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Error from '../Misc/Error/Error';
import LoadingSpinner from '../Misc/LoadingSpinner/LoadingSpinner';
import { useUserContext } from '../../hooks/UserContext';
import { useUnitContext } from '../../hooks/UnitContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import moment from 'moment';
import styles from './ExerciseGraph.module.css';
import Select from '../Misc/Select/Select';
import { convertToLbs } from '../../utils/utils';

export default function ExerciseGraph({ id }) {
    const { user } = useUserContext();
    const [unit] = useUnitContext();
    const [data, loading, error]  = useFetch(user && id && `/users/${user?.id}/exercises/${id}/workouts/best`);
    const [year, setYear] = useState("all");
    const [filteredData, setFilteredData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (data?.authorizationFailed) {
            navigate('/logout');
        }
    }, [data, navigate]);

    useEffect(() => {
        if (year === "all" && data) {
            setFilteredData(data.sets);
        } else {
            setFilteredData(data?.sets.filter(set => {
                return moment(set.date).format("YYYY") === year;
            }));
        }

    }, [data, year]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload?.length) {
            return (
                <div className={styles.tooltip}>
                    <p className={styles.p}>{label}</p>
                    <p className={styles.p}>
                        {`${payload[0].payload.weight} ${unit?.unit === "lbs" ? 'lbs' : 'kg'} x ${payload[0].payload.reps}`}
                    </p>
                    <p>
                    1RM: {payload[0].value} {unit?.unit === "lbs" ? 'lbs' : 'kg'}
                    </p>
                </div>
            );
        }
    };

    const handleChange = e => {
        setYear(e.target.value);
    };

    return (
        <>
            {filteredData?.length && !loading && !error ? (
                <>
                    <h3 className={styles.heading}>Best Set (Est. 1RM)</h3>

                    <div className="floating-input">
                        <Select id="years" onChange={handleChange} value={year} className={styles.select}>
                            <option value="all">All</option>
                            {filteredData.map(set => moment(set.date).format("YYYY"))
                                .filter((date, index, arr) => arr.indexOf(date) === index)
                                .map((date, index) => (
                                    <option key={index} value={moment(date).format("YYYY")}>
                                        {moment(date).format("YYYY")}
                                    </option>
                                ))}
                        </Select>

                        <label htmlFor="years">Years</label>
                    </div>

                    <div className={styles.graph}>
                        <ResponsiveContainer 
                            width="100%" 
                            height="100%"
                            style={{
                                marginLeft: "-1rem"
                            }}
                        >
                            <LineChart data={filteredData.map(set => {
                                return {
                                    weight: unit?.unit === "lbs" ? convertToLbs(set.weight) : set.weight,
                                    reps: set.reps,
                                    date: year === "all" ? moment(set.date).format('DD/MM/YYYY') : moment(set.date).format('Do MMM'),
                                    "1RM": unit?.unit === "lbs" ? convertToLbs(set.one_rep_max) : set.one_rep_max
                                };
                            })}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line type="monotone" dataKey="1RM" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </>
            ) : loading ? <LoadingSpinner /> : error ? <Error text="Failed to load data" /> : (
                <p>
                    A graph showing progress for this exercise will display here - check back later!
                </p>
            )}
            
        </>
    );
}