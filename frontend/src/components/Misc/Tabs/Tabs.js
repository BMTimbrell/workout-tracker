import { useState } from "react";
import styles from './Tabs.module.css';

export default function Tabs({ children, tabNames }) {
    const [tab, setTab] = useState(0);
    children = children.filter(Boolean);

    return (
        <div>
            <ul className={styles["tab-list"]}>
                {tabNames.map((name, index) => (
                    <li key={index}>
                        <button 
                            className={index === tab ? `${styles.tab} ${styles["tab-active"]}` : styles.tab} 
                            onClick={() => setTab(index)}
                        >
                            {name}
                        </button>
                    </li>
                ))}
            </ul>
            <div className={styles["tab-panel"]}>
                {children[tab]}
            </div>
        </div>
    );
}