import React, { useState } from "react";
import DynamicChart from "@/components/DynamicChart";
import { InputWithText } from "@/components/InputWithText";
import { Grid, Subtitle, Text, Title } from "@tremor/react";
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
import { Plus, RotateCcw } from "lucide-react";
import { ChartData, ChartColorOptions, Range } from "@/types/chart";
import { rangeMapping, WEEKS, YEARS } from "@/data/time";
import { api } from "@/lib/axios";
import { serializeProgressReq, serializeProgressRes } from "@/lib/utils";
import { useTypedSelector } from "@/store/store";
import { ChartsWithProgressResponse } from "@/types/api";
import { chartColors } from "@/data/chart";

const ProgressApp = () => {
  const { register, setValue } = useForm(),
    user = useTypedSelector((state) => state.user),
    [userCharts, setUserCharts] = useState<ChartData[][]>([]),
    [userRawCharts, setUserRawCharts] = useState<
      ChartsWithProgressResponse[] | []
    >([]),
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
    ),
    [isChartFormOpen, setIsChartFormOpen] = useState<boolean>(false);

  function addChart() {
    try {
      api.post("/chart-progresses", {
        user_id: user.userId,
        progress_data: serializeProgressReq(chartData),
        progress_name: chartName,
        range_type: selectedRange,
        chart_type: chartType,
        // TODO-not priority: support multiple colors and lines
        chart_color: selectedColors[0],
      });
      getUserCharts();
      resetNewChart();
      setIsChartFormOpen(false);
    } catch (error) {
      alert(error);
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
      [chartName]: progressValue,
      range_value: rangeVal.label,
      progress_value: progressValue,
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
    <div className="w-full grid gap-5">
      {isChartFormOpen && (
        <Grid className="gap-3 sm:gap-5" numCols={1} numColsLg={2}>
          <section className="grid gap-3 sm:gap-5 border border-gray-300 shadow-xl p-6 rounded-xl ">
            <div className="flex justify-between">
              <span className="mb-2">
                <Title>Add New Chart</Title>
                <p className="text-xs text-gray-400">Check the preview</p>
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
                    {/* TODO : support date */}
                    {/* <SelectItem value="date">Date</SelectItem> */}
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
            <Button
              className="-mt-2"
              disabled={chartData?.length < 2}
              variant="outline"
              onClick={addChart}
              title={
                chartData?.length < 2
                  ? "Add more progress to save"
                  : "Save chart to your account"
              }
            >
              Save Chart
            </Button>
          </section>
          {(chartName || selectedRange) && (
            <div className="shadow-xl rounded-xl border pt-6 border-gray-300">
              <div className="flex justify-center">
                <Title className="mb-2">New Chart Preview</Title>
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
      )}

      {!isChartFormOpen && (
        <section className="h-[200px] w-full flex justify-center items-center">
          <Button
            onClick={() => setIsChartFormOpen(true)}
            className="flex gap-x-2 items-center"
          >
            <Plus />
            Add New Chart
          </Button>
        </section>
      )}
      {userCharts.length > 0 && (
        <h2 className="text-center text-xl mt-8">Your Progress Charts :</h2>
      )}
      <Grid className="gap-5" numCols={1} numColsLg={2}>
        {userCharts?.map((chart: any, idx: number) => {
          return (
            <DynamicChart
              editable
              chartType={userRawCharts[idx].chart_type}
              barChartType={userRawCharts[idx].bar_chart_type}
              key={userRawCharts[idx].chart_id}
              chartdata={userCharts[idx].sort(
                (a, b) => Number(a.progress_no) - Number(b.progress_no)
              )}
              colors={[userRawCharts[idx].chart_color]}
              idx={userRawCharts[idx].range_type}
              categoryNames={[userRawCharts[idx].progress_name]}
              chartId={userRawCharts[idx].chart_id}
            />
          );
        })}
      </Grid>
    </div>
  );
};

export default ProgressApp;
