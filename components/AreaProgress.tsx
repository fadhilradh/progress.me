import { ChartData } from "@/types/chart";
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
  categoryNames = [],
  colors = [],
  idx = "monthly",
  maxValue,
}: AreaProgressProps) => {
  return (
    <Card className="shadow-xl rounded-xl p-4 sm:p-6">
      <Title>{categoryNames?.join(" & ")}</Title>
      <AreaChart
        data={chartdata}
        index={idx}
        categories={[...categoryNames]}
        colors={[...colors]}
        valueFormatter={dataFormatter}
        curveType="linear"
        maxValue={maxValue}
        className=""
      />
    </Card>
  );
};

export default AreaProgress;
