import Select from '../Misc/Select/Select';
import { useUserContext } from '../../hooks/UserContext';
import { useUnitContext } from '../../hooks/UnitContext';
import useFetch from '../../hooks/useFetch';
import LoadingSpinner from '../Misc/LoadingSpinner/LoadingSpinner';
import Error from '../Misc/Error/Error';

export default function Profile() {
    const { user } = useUserContext();
    const [userData, loading, error] = useFetch(user?.id && `/users/${user?.id}`);
    const [unit, setUnit] = useUnitContext();

    const handleSelectChange = e => {
        setUnit({
            unit: e.target.value
        });
    };

    return (
        <>
            <h1>Profile</h1>

            {userData && !loading && !error ? (
                <div>  
                    <div>{userData.name}</div>
                    <div>{userData.email}</div>

                </div>
            ) : loading ? <LoadingSpinner /> : <Error text="Failed to load data." />}

            <Select value={unit?.unit === "lbs" ? "lbs" : "kg"} onChange={handleSelectChange}>
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
            </Select>
        </>
    );
}