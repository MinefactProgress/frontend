import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  TooltipItem,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { useMantineTheme } from "@mantine/core";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  ChartTooltip,
  Legend,
  Filler,
  ArcElement,
  BarElement
);

export const LineChart = ({
  dataset,
  height,
}: {
  dataset: {
    data: any;
    label: string;
    labels: any;
    borderColor?: any;
    backgroundColor?: any;
    tooltip?:
      | ((tooltipItem: TooltipItem<"line">) => string | string[] | void)
      | undefined;
  };
  height?: string;
}) => {
  const theme = useMantineTheme();
  return (
    <Line
      options={{
        responsive: true,
        scales: {
          x: {
            grid: {
              display: true,
              color:
                (theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[1]) + "ee",
              z: 1,
            },
            min: 0,
            max: 100,
          },
          y: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label:
                dataset.tooltip ||
                function (tooltipItem) {
                  return " " + Math.round(tooltipItem.parsed.y);
                },
            },
          },
        },
      }}
      height={height || "100px"}
      data={{
        labels: dataset.labels,
        datasets: [
          {
            label: dataset.label,
            data: dataset.data,
            borderColor: dataset.borderColor || theme.colors.orange[7],
            backgroundColor:
              dataset.backgroundColor || theme.colorScheme === "dark"
                ? theme.colors.dark[7]
                : theme.white,
            tension: 0.1,
            fill: true,
            borderWidth: 2,
          },
        ],
      }}
    />
  );
};
