import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
    ChartData,
    ChartOptions,
    ChartType,
    TooltipItem
} from "chart.js/auto";
import { getNColors } from "./utils/getNColors";
import stylesChart from "./styles/Chart.scss";

const borderWidth = 1;

const options: ChartOptions = {
    plugins: {
        tooltip: {
            callbacks: {
                label: (tooltipItems: TooltipItem<ChartType>) => (
                    `${tooltipItems.label}: ${tooltipItems.formattedValue}%`
                )
            }
        }
    }
};

interface Props {
    data: ChartData
}

export default function Chart(props: Props) {
    const chartData: ChartData = {
        ...props.data,
        datasets: props.data.datasets.map((dataset) => ({
            data: dataset.data,
            backgroundColor: getNColors(dataset.data.length).map((rgb: number[]) => (
                `rgb(${rgb.join(", ")})`
            )),
            borderWidth
        }))
    };

    if (props.data.datasets.every((dataset) => (
        dataset.data.every((value) => value === 0) // returns true for an empty array
    ))) {
        return (
            <div className={stylesChart.alert}>
                Портфель пуст
            </div>
        );
    }

    return (
        <Doughnut
            data={chartData}
            options={options}
        />
    );
}
