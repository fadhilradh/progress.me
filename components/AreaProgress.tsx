import { ChartData, ColorOptions } from "@/types/tremor";
import { Card, Title, AreaChart } from "@tremor/react";

const dataFormatter = (number: number) =>
  `${Intl.NumberFormat("us").format(number).toString()}`;

interface AreaProgressProps {
  chartdata: ChartData[];
  categoryName: string[];
  colors: ColorOptions;
}

// eslint-disable-next-line react/display-name
const AreaProgress = ({
  chartdata,
  categoryName,
  colors,
}: AreaProgressProps) => {
  return (
    <Card>
      <Title>{...categoryName}</Title>
      <AreaChart
        className=""
        data={chartdata}
        index="month"
        categories={[...categoryName]}
        colors={[...colors]}
        valueFormatter={dataFormatter}
        yAxisWidth={40}
      />
    </Card>
  );
};

export default AreaProgress;
