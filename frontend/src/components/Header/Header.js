import { NavLink, Link } from 'react-router-dom';
import { useUserContext } from '../../hooks/UserContext';
import styles from './Header.module.css';
import { faPlus, faRightToBracket, faRightFromBracket, faUser, faDumbbell, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

export default function Header() {
    const { user } = useUserContext();
    const [showMenu, setShowMenu] = useState(false);

    const hideHamburger = () => {
        // no hamburger when logged out
        if (!user) return;
        setShowMenu(false);
    }

    return (
        <header className={styles.header}>
            <div className={styles['header-content']}>
                <Link className={styles.logo} to="/" onClick={hideHamburger}>Workout Tracker</Link>

                <nav className={
                    user && showMenu ? `${styles.nav} ${styles['logged-in']} ${styles['nav-open']}` : 
                    user ? `${styles.nav} ${styles['logged-in']}`: 
                    styles.nav
                }>
                    <ul className={user ? `${styles['nav-list']} ${styles['logged-in']}` : styles['nav-list']}>
                        <li key="home">
                            <NavLink 
                                    to="/" 
                                    className={({isActive}) => 
                                        isActive ? `${styles['nav-link']} ${styles['nav-link-active']}` : styles['nav-link']
                                    }
                                    onClick={hideHamburger}
                                >
                                    <FontAwesomeIcon className={styles.icon} icon={faPlus} />
                                    Start Workout
                            </NavLink>
                        </li>

                        {user && (
                            <>
                                <li key="profile">
                                    <NavLink 
                                            to="/profile" 
                                            className={({isActive}) => 
                                                isActive ? `${styles['nav-link']} ${styles['nav-link-active']}` : styles['nav-link']
                                            }
                                            onClick={hideHamburger}
                                        >
                                            <FontAwesomeIcon className={styles.icon} icon={faUser} />
                                            Profile
                                    </NavLink>
                                </li>

                                <li key="exercises">
                                    <NavLink 
                                            to="/exercises" 
                                            className={({isActive}) => 
                                                isActive ? `${styles['nav-link']} ${styles['nav-link-active']}` : styles['nav-link']
                                            }
                                            onClick={hideHamburger}
                                        >
                                            <FontAwesomeIcon className={styles.icon} icon={faDumbbell} />
                                            Exercises
                                    </NavLink>
                                </li>

                                <li key="history">
                                    <NavLink 
                                            to="/history" 
                                            className={({isActive}) => 
                                                isActive ? `${styles['nav-link']} ${styles['nav-link-active']}` : styles['nav-link']
                                            }
                                            onClick={hideHamburger}
                                        >
                                            <FontAwesomeIcon className={styles.icon} icon={faClock} />
                                            History
                                    </NavLink>
                                </li>
                            </>
                        )}

                        {!user && (
                            <li key="login">
                                <NavLink 
                                        to="/login" 
                                        className={({isActive}) => 
                                            isActive ? `${styles['nav-link']} ${styles['nav-link-active']}` : styles['nav-link']
                                        }
                                    >
                                        <FontAwesomeIcon className={styles.icon} icon={faRightToBracket} />
                                        Login
                                </NavLink>
                            </li>
                        )}

                        {user && (
                            <li key="logout">
                                <NavLink 
                                        to="/logout" 
                                        className={({isActive}) => 
                                            isActive ? `${styles['nav-link']} ${styles['nav-link-active']}` : styles['nav-link']
                                        }
                                        onClick={hideHamburger}
                                    >
                                        <FontAwesomeIcon className={styles.icon} icon={faRightFromBracket} />
                                        Logout
                                </NavLink>
                            </li>
                        )}
                    </ul>

                </nav>

                {user && (
                    <div className={showMenu ? `${styles.hamburger} ${styles['hamburger-open']}` : styles.hamburger} onClick={() => setShowMenu(!showMenu)}>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                    </div>
                )}

            </div>
        </header>
    );
}