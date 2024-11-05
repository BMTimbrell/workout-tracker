import styles from './Select.module.css';

export default function Select({ onChange, children, id }) {

    return (
        <div className={styles.select}>
            <select id={id} onChange={onChange}>
                {children}
            </select>
            <div className={styles.arrow}></div>
        </div>
    );
}