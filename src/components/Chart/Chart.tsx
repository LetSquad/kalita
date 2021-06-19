import React from "react";
import { Doughnut } from "react-chartjs-2";
import ChartJS from "chart.js/auto";
import styles from "./styles/Chart.scss";

interface Props {
    data: ChartJS.ChartData
}

export default function Chart(props: Props) {
    return (
        <Doughnut
            data={props.data}
            type={ChartJS.ChartData}
            className={styles.chart}
        />
    );
}
