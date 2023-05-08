import { ChartData, ColorOptions } from "@/types/tremor";
import { Card, Title, AreaChart } from "@tremor/react";

const dataFormatter = (number: number) =>
  `${Intl.NumberFormat("us").format(number).toString()}`;

interface AreaProgressProps {
  chartdata: ChartData[];
  categoryNames: string[];
  colors: any;
  idx?: string;
  maxValue?: number;
}

// eslint-disable-next-line react/display-name
const AreaProgress = ({
  chartdata,
  categoryNames,
  colors,
  idx = "month",
  maxValue,
}: AreaProgressProps) => {
  return (
    <Card className="bg-slate-100 rounded-xl">
      <Title>{categoryNames.join(" & ")}</Title>
      <AreaChart
        data={chartdata}
        index={idx}
        categories={[...categoryNames]}
        colors={[...colors]}
        valueFormatter={dataFormatter}
        yAxisWidth={60}
        curveType="linear"
        maxValue={maxValue}
        className="h-[500px]"
      />
    </Card>
  );
};

export default AreaProgress;
