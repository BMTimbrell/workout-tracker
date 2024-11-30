import { useState, useEffect, useRef } from "react";
import styles from './Tabs.module.css';

export default function Tabs({ children, tabNames, tabPanelRef }) {
    const [tab, setTab] = useState(0);
    const tabListRef = useRef(null);

    children = children.filter(Boolean);

    useEffect(() => {
        // set tab list height property for tab panel max height calculation
        if (
            tabListRef?.current && 
            (!tabPanelRef?.current.style.getPropertyValue('--tab-list-height') ||
            tabPanelRef?.current.style.getPropertyValue('--tab-list-height') === "0px")
        ) {
            document.documentElement.style.setProperty('--tab-list-height', tabListRef.current.offsetHeight + 'px');
        }
    }, [children, tabPanelRef]);

    return (
        <>
            <ul ref={tabListRef} className={styles["tab-list"]}>
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

            <div ref={tabPanelRef} className={styles["tab-panel"]}>
                {children[tab]}
            </div>
        </>
    );
}