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

import { Bar } from "react-chartjs-2";
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

export const BarChart = ({
  dataset,
  height,
}: {
  dataset: {
    data: any;
    label: string;
    labels: any;
    borderColor?: any;
    backgroundColor?: any;
    tooltip?: (tooltipItem: TooltipItem<"bar">) => string | string[] | void;
  };
  height?: string;
}) => {
  const theme = useMantineTheme();
  return (
    <Bar
      options={{
        indexAxis: "y" as const,
        elements: {
          bar: {
            borderWidth: 1,
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[1],
          },
        },
        responsive: true,
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
                  return Math.round(tooltipItem.parsed.x * 10) / 10 + "%";
                },
            },
          },
        },

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
      }}
      height={height || "100px"}
      data={{
        labels: dataset.labels,
        datasets: [
          {
            label: dataset.label,
            data: dataset.data,
            borderColor:
              dataset.borderColor ||
              function (context) {
                const index = context.dataIndex;
                const value = context.dataset.data[index];
                if (!value) return theme.colors.red[7];
                return value >= 10
                  ? value == 100
                    ? theme.colors.green[7]
                    : theme.colors.orange[7]
                  : theme.colors.red[7];
              },
            barThickness: 25,
            minBarLength: 2,
            backgroundColor:
              dataset.backgroundColor ||
              function (context) {
                const index = context.dataIndex;
                const value = context.dataset.data[index];
                if (!value) return theme.colors.red[7];
                return value >= 10
                  ? value == 100
                    ? theme.colors.green[7]
                    : theme.colors.orange[7]
                  : theme.colors.red[7];
              },
          },
        ],
      }}
    />
  );
};
