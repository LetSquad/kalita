import React from "react";
import kalitaImages from "../../static/images/kalita.png";
import styles from "./styles/Kalita.scss";

export function Kalita() {
    return (
        <>
            <img src={kalitaImages} alt="Kalita" className={styles.contentImage} />
            <span className={styles.contentTitle}>KALITA</span>
            <div className={styles.separator} />
            <span className={styles.contentText}>Светлое инвестиционное будущее</span>
        </>
    );
}
