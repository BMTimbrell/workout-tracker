import { Outlet } from 'react-router-dom';
import { UserProvider } from '../../hooks/UserContext';
import Header from '../Header/Header';

function Root() {

    return (
        <UserProvider>
            <Header />
            <main>
                <Outlet />
            </main>
        </UserProvider>
    );
}

export default Root;