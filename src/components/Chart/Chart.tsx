import { Chart as ChartJs, registerables } from "chart.js";
import {
    ChartData,
    ChartOptions,
    ChartType,
    TooltipItem
} from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";

import stylesChart from "./styles/Chart.scss";
import { getNColors } from "./utils/getNColors";

ChartJs.register(...registerables);

const borderWidth = 1;

const options: ChartOptions<"doughnut"> = {
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

interface ChartProps {
    data: ChartData<"doughnut", number[]>
}

export default function Chart(props: ChartProps) {
    const chartData: ChartData<"doughnut", number[]> = {
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
