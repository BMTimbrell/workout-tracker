import Select from '../Misc/Select/Select';
import { useUserContext } from '../../hooks/UserContext';
import { useUnitContext } from '../../hooks/UnitContext';

export default function Profile() {
    const { user } = useUserContext();
    const [unit, setUnit] = useUnitContext();

    const handleSelectChange = e => {
        setUnit({
            unit: e.target.value
        });
    };

    return (
        <>
            <h1>Profile</h1>

            <Select value={unit?.unit === "lbs" ? "lbs" : "kg"} onChange={handleSelectChange}>
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
            </Select>
        </>
    );
}