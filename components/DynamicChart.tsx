import { ChartData } from "@/types/chart";
import { Card, AreaChart, BarChart, LineChart, Button } from "@tremor/react";
import { UUID } from "crypto";
import { EditIcon } from "lucide-react";
import Link from "next/link";
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
  wrapperClassName?: string;
  chartId?: UUID;
  editable: boolean;
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
  wrapperClassName = "",
  chartId,
  editable,
}: DynamicChartProps) => {
  const chartTypeMapping: Record<string, any> = {
    area: AreaChart,
    line: LineChart,
    bar: BarChart,
  };

  return (
    <Card
      className={`shadow-xl rounded-xl p-4 sm:p-6 cursor-pointer flex flex-col items-end ${wrapperClassName}`}
    >
      
      {React.createElement(chartTypeMapping[chartType], {
        data: chartdata,
        index: idx,
        categories: [...categoryNames],
        colors: [...colors],
        valueFormatter: dataFormatter,
        maxValue: maxValue,
        layout: barChartType,
        className: "cursor-pointer " + className,
        yAxisWidth: String(maxValue).length * 6 + 25,
      })}
      {editable && (
        <Button>
          <Link href={`/charts/${chartId}`}>
            Edit
          </Link>
        </Button>
      )}
    </Card>
  );
};

export default DynamicChart;
