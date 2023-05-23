import React, { useState } from "react";
import DynamicChart from "@/components/DynamicChart";
import { InputWithText } from "@/components/InputWithText";
import { AreaChart, Card, Grid } from "@tremor/react";
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
import { MONTHS, WEEKS, YEARS } from "@/data/time";
import { api } from "@/lib/axios";
import { serializeProgressReq, serializeProgressRes } from "@/lib/utils";
import { useTypedSelector } from "@/store/store";
import { ChartsWithProgressResponse } from "@/types/api";
import { chartColors } from "@/data/chart";

const rangeMapping: Record<string, Range[]> = {
  monthly: MONTHS,
  yearly: YEARS,
  weekly: WEEKS,
};

const ProgressApp = () => {
  const { register, setValue } = useForm(),
    [selectedColors, setChartColor] = useState<ChartColorOptions[]>(["blue"]),
    [progressName, setProgressName] = useState<string>(""),
    [progressValue, setProgressValue] = useState<number | "">(),
    [selectedRange, setSelectedRange] = useState<string>(""),
    [chartData, setChartData] = useState<ChartData[]>([]),
    [maxValue, setMaxValue] = useState<number>(0),
    [isCreatingChart, setIsCreatingChart] = useState<boolean>(false),
    user = useTypedSelector((state) => state.user),
    [userCharts, setUserCharts] = useState<ChartData[][]>([]),
    [userRawCharts, setUserRawCharts] = useState<
      ChartsWithProgressResponse[] | []
    >([]),
    [filteredRange, setFilteredRange] = useState<any>(null),
    [rangeVal, setRangeVal] = useState<Range>({ label: "", value: 0 }),
    [rangeVals, setRangeVals] = useState<number[]>([]),
    [chartType, setChartType] = useState<"area" | "line" | "bar">("area"),
    [barChartType, setBarChartType] = useState<"vertical" | "horizontal">(
      "horizontal"
    );
  function addChart() {
    try {
      api.post("/chart-progresses", {
        user_id: user.userId,
        progress_data: serializeProgressReq(chartData),
        progress_name: progressName,
        range_type: selectedRange,
        // TODO-not priority: support multiple colors
        chart_color: selectedColors[0],
      });
      getUserCharts();
      resetNewChart();
    } catch (error) {
      alert(error);
    }
  }

  function resetNewChart() {
    setValue("range", "Select");
    setProgressValue(0);
    setIsCreatingChart(false);
    setChartData([]);
    setProgressName("");
    setValue("range", "");
    setSelectedRange("");
  }

  async function getUserCharts() {
    try {
      const res = await api.get(`/chart-progresses/${user.userId}`);
      setUserRawCharts(res.data);
      setUserCharts(serializeProgressRes(res.data));
    } catch (e) {
      console.error(e);
    }
  }

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

  React.useEffect(() => {
    getUserCharts();
  }, []);

  function addProgress() {
    const newData = {
      [selectedRange]: rangeVal.label,
      progress_no: rangeVal.value,
      [progressName]: progressValue,
    };
    setChartData(
      // @ts-ignore-next-line
      chartData.length === 0
        ? [newData]
        : [...chartData, newData].sort(
            (a, b) => Number(a.progress_no) - Number(b.progress_no)
          )
    );
    setRangeVals([...rangeVals, rangeVal.value]);
    setRangeVal({ label: "", value: 0 });
    setProgressValue("");
    setIsCreatingChart(true);
    setTimeout(() => {
      const maxval = Math.max(
        ...[
          ...chartData?.map((data) => Number(data[progressName])),
          Number(progressValue),
        ]
      );
      console.log("max:", maxval);
      setMaxValue(maxval);
    }, 500);
    setRangeVals([...rangeVals, rangeVal.value]);
  }

  return (
    <div className="w-full grid gap-5">
      <h2>Your Charts :</h2>
      <Grid className="gap-5" numCols={1} numColsLg={2}>
        {userCharts?.map((chart: any, idx: number) => {
          return (
            <DynamicChart
              chartType="area"
              key={userRawCharts[idx].chart_id}
              chartdata={userCharts[idx].sort(
                (a, b) => Number(a.progress_no) - Number(b.progress_no)
              )}
              colors={[userRawCharts[idx].chart_color]}
              idx={userRawCharts[idx].range_type}
              categoryNames={[userRawCharts[idx].progress_name]}
            />
          );
        })}
      </Grid>
      <Grid className="gap-3 sm:gap-5" numCols={1} numColsLg={2}>
        <section className="grid gap-3 sm:gap-5 border border-gray-300 shadow-xl p-6 rounded-xl ">
          <h4 className="text-2xl mb-2">Add New Chart</h4>
          <div className="flex justify-between items-center">
            <InputWithText
              disabled={isCreatingChart}
              value={progressName}
              onChange={setProgressName}
              label="Chart Name"
              placeholder="E.g. Weight lifted, courses completed, average daily expense"
            />
            {isCreatingChart && (
              <Button
                onClick={resetNewChart}
                title="Reset data"
                variant="ghost"
              >
                <RotateCcw />
              </Button>
            )}
          </div>
          <section className="flex sm:flex-row flex-col gap-5 sm:gap-0 justify-between">
            <div className="grid w-full items-center gap-2 ">
              <Label>Chart Type</Label>
              <Select onValueChange={setChartType} value={chartType}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="area">Area</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="line">Line</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {chartType == "bar" && (
              <div className="grid w-full items-center gap-2 ">
                <Label>Bar Chart Layout</Label>
                <Select onValueChange={setBarChartType} value={barChartType}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Select bar chart layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vertical">Vertical</SelectItem>
                    <SelectItem value="horizontal">Horizontal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </section>
          <section className="flex sm:flex-row flex-col gap-5 sm:gap-0 justify-between">
            <div className="grid w-full items-center gap-2 ">
              <Label>Track by</Label>
              <Select
                disabled={isCreatingChart}
                onValueChange={setSelectedRange}
                value={selectedRange}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Weekly, monthly or yearly" />
                </SelectTrigger>
                <SelectContent>
                  {/* TODO : support date */}
                  {/* <SelectItem value="date">Date</SelectItem> */}
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full items-center gap-2 ">
              <Label>Chart Color</Label>
              <Select
                onValueChange={(e) => setChartColor([e])}
                value={selectedColors[0]}
              >
                <SelectTrigger className="w-[250px] capitalize">
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
            </div>
          </section>
          {selectedRange && (
            <section className="flex flex-col gap-y-3">
              <Label className="text-xl my-3 underline">Add Progress</Label>
              <Label className="capitalize -mb-1">
                {selectedRange.substring(0, selectedRange.length - 2)}
              </Label>
              <Select
                onValueChange={(v: Range) => setRangeVal(v)}
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
                label={progressName}
                placeholder="Your progress (in numbers)"
              />
            </section>
          )}
          <Button
            disabled={!progressValue}
            variant="subtle"
            onClick={addProgress}
          >
            Add Progress
          </Button>
          <Button
            disabled={chartData?.length < 2}
            variant="outline"
            onClick={addChart}
            title={
              chartData?.length < 2
                ? "Add more progress to save"
                : "Save your chart to cloud"
            }
          >
            Save Chart
          </Button>
        </section>
        <Card className="shadow-xl">
          <div className="flex justify-center">
            <p className="text-lg font-semibold my-2">Chart Preview</p>
          </div>
          <DynamicChart
            colors={selectedColors}
            categoryNames={[progressName]}
            chartdata={chartData}
            idx={selectedRange}
            maxValue={maxValue}
            chartType={chartType}
            barChartType={barChartType}
          />
        </Card>
      </Grid>
    </div>
  );
};

export default ProgressApp;
