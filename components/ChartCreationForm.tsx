import React, { useState } from "react";
import DynamicChart from "@/components/DynamicChart";
import { InputWithText } from "@/components/InputWithText";
import { Grid, Title } from "@tremor/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";
import { ChartData, ChartColorOptions, Range } from "@/types/chart";
import { rangeMapping } from "@/data/time";
import { api } from "@/lib/axios";
import { serializeProgressReq } from "@/lib/utils";
import { chartColors } from "@/data/chart";
import { useToast } from "./ui/use-toast";

interface ChartCreationFormProps {
  userId: string | null  | undefined;
  getUserCharts: () => void;
  setIsChartFormOpen: (isOpen: boolean) => void;
  userData: any;
}

const ChartCreationForm: React.FC<ChartCreationFormProps> = ({
  userId,
  getUserCharts,
  setIsChartFormOpen,
  userData,
}) => {
  const { register, setValue } = useForm(),
    [selectedColors, setChartColor] = useState<ChartColorOptions[]>(["blue"]),
    [chartName, setchartName] = useState<string>(""),
    [progressValue, setProgressValue] = useState<number | "">(),
    [selectedRange, setSelectedRange] = useState<string>(""),
    [chartData, setChartData] = useState<ChartData[]>([]),
    [maxValue, setMaxValue] = useState<number>(0),
    [isCreatingChart, setIsCreatingChart] = useState<boolean>(false),
    [filteredRange, setFilteredRange] = useState<any>(null),
    [rangeVal, setRangeVal] = useState<Range>({ label: "", value: 0 }),
    [rangeVals, setRangeVals] = useState<number[]>([]),
    [chartType, setChartType] = useState<"area" | "line" | "bar">("area"),
    [barChartType, setBarChartType] = useState<"vertical" | "horizontal">(
      "horizontal"
    );

    const { toast } = useToast();

  React.useEffect(() => {
    setFilteredRange(rangeMapping?.[selectedRange]);
  }, [selectedRange]);

  React.useEffect(() => {
    setFilteredRange(
      rangeMapping[selectedRange]?.filter(
        (r: Range) => !rangeVals?.includes(r?.value)
      )
    );
  }, [rangeVals.length]);

  async function addChart() {
    try {
      await api.post("/chart-progresses", {
        user_id: userId,
        progress_data: serializeProgressReq(chartData),
        progress_name: chartName,
        range_type: selectedRange,
        chart_type: chartType,
        chart_color: selectedColors[0],
      });
      toast({
        title: "Chart created successfully",
        description: "Your chart has been saved to your account",
        variant: "default",
      });
      resetNewChart();
      setIsChartFormOpen(false);
      await getUserCharts();
    } catch (e) {
      toast({
        title: "Error creating chart",
        description: "Something happened on our end. Please try again later",
        variant: "destructive",
      });
      console.error(e);
    }
  }

  function resetNewChart() {
    setValue("range", "Select");
    setProgressValue("");
    setIsCreatingChart(false);
    setChartData([]);
    setchartName("");
    setValue("range", "");
    setSelectedRange("");
  }

  function addProgress() {
    const newData = {
      [selectedRange]: rangeVal.label,
      progress_no: rangeVal.value,
      [chartName]: progressValue,
      range_value: rangeVal.label,
      progress_value: progressValue,
    };
    setChartData(
      chartData.length === 0
        ? [newData]
        : [...chartData, newData].sort(
            (a: ChartData, b: ChartData) => Number(a.progress_no) - Number(b.progress_no)
          )
    );
    setRangeVals([...rangeVals, rangeVal.value]);
    setRangeVal({ label: "", value: 0 });
    setProgressValue("");
    setIsCreatingChart(true);
    setTimeout(() => {
      const maxval = Math.max(
        ...[
          ...chartData?.map((data) => Number(data[chartName])),
          Number(progressValue),
        ]
      );
      console.log("max:", maxval);
      setMaxValue(maxval);
    }, 500);
    setRangeVals([...rangeVals, rangeVal.value]);
  }

  return (
    <Grid className="gap-3 sm:gap-5" numCols={1} numColsLg={2}>
      <section className="grid gap-3 sm:gap-5 border border-gray-300 shadow-xl p-6 rounded-xl ">
        <div className="flex justify-between">
          <span className="mb-2">
            <Title className="text-blue-600 font-bold text-2xl">Add New Progress Chart</Title>
            <p className="text-sm text-gray-500">
              Check the preview as you type
            </p>
          </span>
          {isCreatingChart && (
            <Button
              onClick={resetNewChart}
              title="Reset data"
              variant="destructive"
              className="-mb-3 px-2 flex justify-center items-center"
            >
              <RotateCcw size="20" />
            </Button>
          )}
        </div>
        <div className="flex justify-between items-center">
          <InputWithText
            disabled={isCreatingChart}
            value={chartName}
            onChange={setchartName}
            label="Chart Name"
            placeholder="E.g. Weight lifted, courses completed, average daily expense"
          />
        </div>
        <section className="flex sm:flex-row flex-col gap-5 sm:gap-0 justify-between">
          <span className="grid w-full items-center gap-2 ">
            <Label>Chart Type</Label>
            {/* @ts-ignore */}
            <Select onValueChange={setChartType} value={chartType}>
              <SelectTrigger className="w-[250px] sm:w-[125px]">
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="area">Area</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
                <SelectItem value="line">Line</SelectItem>
              </SelectContent>
            </Select>
          </span>
          {chartType == "bar" && (
            <div className="grid w-full items-center gap-2 ">
              <Label>Bar Chart Layout</Label>
              {/* @ts-ignore */}
              <Select onValueChange={setBarChartType} value={barChartType}>
                <SelectTrigger className="w-[250px] sm:w-[125px]">
                  <SelectValue placeholder="Select bar chart layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vertical">Vertical</SelectItem>
                  <SelectItem value="horizontal">Horizontal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <span className="grid w-full items-center gap-2 ">
            <Label>Chart Color</Label>
            <Select
              // @ts-ignore
              onValueChange={(e) => setChartColor([e])}
              value={selectedColors[0]}
            >
              <SelectTrigger className="w-[250px] sm:w-[125px] capitalize">
                <SelectValue placeholder="Your favorite chart color" />
              </SelectTrigger>
              <SelectContent>
                {chartColors?.map((color: ChartColorOptions) => (
                  <SelectItem
                    className="capitalize"
                    key={color}
                    value={color}
                  >
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </span>
        </section>
        <section className="flex sm:flex-row flex-col gap-5 sm:gap-0 justify-between">
          <div className="grid w-full items-center gap-2 ">
            <Label>Track by</Label>
            <Select
              disabled={isCreatingChart}
              required
              /* @ts-ignore */
              onValueChange={setSelectedRange}
              value={selectedRange}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Weekly, monthly or yearly" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>
        {selectedRange && (
          <section className="flex flex-col gap-y-3">
            <Title className="my-3">Add Progress</Title>
            <Label className="capitalize -mb-1">
              {selectedRange.substring(0, selectedRange.length - 2)}
            </Label>
            <Select
              // @ts-ignore
              onValueChange={(v: Range) => setRangeVal(v)}
              // @ts-ignore
              value={rangeVal}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent {...register("range")}>
                {filteredRange?.map((time: any) => (
                  <SelectItem
                    className="capitalize"
                    key={time.value}
                    value={time}
                  >
                    {time.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <InputWithText
              type="number"
              value={progressValue}
              onChange={setProgressValue}
              label={chartName}
              placeholder="Your progress (in numbers)"
            />
          </section>
        )}
        <Button
          className="mt-3"
          disabled={!progressValue || !chartName || !selectedRange}
          variant="subtle"
          onClick={addProgress}
        >
          Add Progress
        </Button>
        <div className="w-full" title={
              chartData?.length < 2 || userId == null
                ? "Sign in and add more progress to save chart"
                : "Save chart to your account"
        }>
          <Button
            className="-mt-2 w-full"
            disabled={chartData?.length < 2 || userId == null}
            variant="outline"
            onClick={addChart}
            
          >
            Save Chart
          </Button>
        </div>
        
      </section>
      {(chartName || selectedRange) && (
        <div className="shadow-xl rounded-xl border pt-6 border-gray-300">
          <div className="flex justify-center">
            <Title className="mb-2">Preview</Title>
          </div>
          <DynamicChart
            editable={false}
            colors={selectedColors}
            categoryNames={[chartName]}
            chartdata={chartData}
            idx={selectedRange}
            maxValue={maxValue}
            chartType={chartType}
            barChartType={barChartType}
            wrapperClassName="shadow-none ring-0 rounded-xl"
          />
        </div>
      )}
    </Grid>
  );
};

export default ChartCreationForm; 