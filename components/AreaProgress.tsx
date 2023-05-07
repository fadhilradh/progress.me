import { ChartData, ColorOptions } from "@/types/tremor";
import { Card, Title, AreaChart } from "@tremor/react";

const dataFormatter = (number: number) =>
  `${Intl.NumberFormat("us").format(number).toString()}`;

interface AreaProgressProps {
  chartdata: ChartData[];
  categoryNames: string[];
  colors: ColorOptions;
}

// eslint-disable-next-line react/display-name
const AreaProgress = ({
  chartdata,
  categoryNames,
  colors,
}: AreaProgressProps) => {
  return (
    <Card className="bg-slate-100 rounded-xl">
      <Title>{categoryNames.join(" & ")}</Title>
      <AreaChart
        data={chartdata}
        index="month"
        categories={[...categoryNames]}
        colors={[...colors]}
        valueFormatter={dataFormatter}
        yAxisWidth={60}
        curveType="linear"
      />
    </Card>
  );
};

export default AreaProgress;
