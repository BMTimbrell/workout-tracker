import { Outlet } from 'react-router-dom';
import { UserProvider } from '../../hooks/UserContext';
import { UnitProvider } from '../../hooks/UnitContext';
import Header from '../Header/Header';

function Root() {

    return (
        <UserProvider>
            <Header />
            <UnitProvider>
                <main>
                    <Outlet />
                </main>
            </UnitProvider>
        </UserProvider>
    );
}

export default Root;