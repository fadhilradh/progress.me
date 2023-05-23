import { ChartData } from "@/types/chart";
import { Card, Title, AreaChart, BarChart, LineChart } from "@tremor/react";
import React from "react";

const dataFormatter = (number: number) =>
  `${Intl.NumberFormat("us").format(number).toString()}`;

interface DynamicChartProps {
  chartdata: ChartData[];
  categoryNames: string[];
  colors: any;
  idx?: string;
  maxValue?: number;
  chartType: "area" | "line" | "bar";
  barChartType?: "vertical" | "horizontal";
  className?: string;
}

// eslint-disable-next-line react/display-name
const DynamicChart = ({
  chartdata,
  categoryNames = [],
  colors = [],
  idx = "monthly",
  maxValue,
  chartType = "area",
  barChartType = "vertical",
  className = "",
}: DynamicChartProps) => {
  const chartTypeMapping: Record<string, any> = {
    area: AreaChart,
    line: LineChart,
    bar: BarChart,
  };
  return (
    <Card className={`shadow-xl rounded-xl p-4 sm:p-6 ${className}`}>
      <Title>{categoryNames?.join(" & ")}</Title>
      {React.createElement(chartTypeMapping[chartType], {
        data: chartdata,
        index: idx,
        categories: [...categoryNames],
        colors: [...colors],
        valueFormatter: dataFormatter,
        maxValue: maxValue,
        layout: barChartType,
      })}
    </Card>
  );
};

export default DynamicChart;
