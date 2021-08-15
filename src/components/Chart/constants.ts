import { ChartOptions, ChartType, TooltipItem } from "chart.js/auto";

export const borderWidth = 1;

export const options: ChartOptions = {
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
