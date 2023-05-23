import React, { useState } from "react";
import AreaProgress from "@/components/AreaProgress";
import { InputWithText } from "@/components/InputWithText";
import { Grid } from "@tremor/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PlaceholderCharts from "./PlaceholderCharts";
import { Label } from "./ui/label";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";
import { chartColors, ChartData, Range } from "@/types/chart";
import { MONTHS, WEEKS, YEARS } from "@/data/time";
import { api } from "@/lib/axios";
import { serializeProgressReq, serializeProgressRes } from "@/lib/utils";
import { useTypedSelector } from "@/store/store";
import { ChartsWithProgressResponse } from "@/types/api";

const rangeMapping: Record<string, Range[]> = {
  monthly: MONTHS,
  yearly: YEARS,
  weekly: WEEKS,
};

const ProgressApp = () => {
  const { register, handleSubmit, control, getValues, setValue } = useForm(),
    [chartColor, setChartColor] = useState<string>(""),
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
    [rangeVals, setRangeVals] = useState<number[]>([]);

  function addChart() {
    try {
      api.post("/chart-progresses", {
        user_id: user.userId,
        progress_data: serializeProgressReq(chartData),
        progress_name: progressName,
        range_type: selectedRange,
        chart_color: chartColor,
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

  function updateSelectedRanges(v: Range) {
    setRangeVal(v);
  }

  React.useEffect(() => {
    console.log("chartdata:", chartData);
  }, [chartData.length]);

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
    // console.log(userCharts);
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
    <Grid className="gap-5" numCols={1} numColsLg={2}>
      <h2>Your Charts :</h2>
      {userCharts?.map((chart: any, idx: number) => {
        return (
          <AreaProgress
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
      {/* <PlaceholderCharts /> */}
      <section className="border border-gray-300 shadow-xl p-6 rounded-xl grid gap-y-5">
        <h4 className="text-2xl ">Add New Chart</h4>
        <div className="flex justify-between items-center">
          <InputWithText
            disabled={isCreatingChart}
            value={progressName}
            onChange={setProgressName}
            label="Chart Name"
            placeholder="E.g. Weight lifted, courses completed, average daily expense"
          />
          {isCreatingChart && (
            <Button onClick={resetNewChart} title="Reset data" variant="ghost">
              <RotateCcw />
            </Button>
          )}
        </div>
        <div className="grid w-full items-center gap-1.5 ">
          <Label>Track by</Label>
          <Select
            disabled={isCreatingChart}
            onValueChange={setSelectedRange}
            value={selectedRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={selectedRange} />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="date">Date</SelectItem> */}
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-full items-center gap-1.5 ">
          <Label>Chart Color</Label>
          <Select onValueChange={setChartColor} value={chartColor}>
            <SelectTrigger className="w-[180px] capitalize">
              <SelectValue placeholder="Your favorite chart color" />
            </SelectTrigger>
            <SelectContent>
              {chartColors?.map((color: any) => (
                <SelectItem className="capitalize" key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedRange && (
          <section className="flex flex-col gap-y-3">
            <Label className="text-xl my-3">Add Progress</Label>
            <Label className="capitalize -mb-1">
              {selectedRange.substring(0, selectedRange.length - 2)}
            </Label>

            <Select
              onValueChange={(v: Range) => updateSelectedRanges(v)}
              value={rangeVal}
            >
              <SelectTrigger className="w-[180px]">
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
              value={progressValue}
              onChange={setProgressValue}
              label={progressName}
              placeholder="Your progress value"
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
        >
          Save Chart
        </Button>
      </section>
      <section>
        <div className="flex justify-center ">
          <p className="text-lg font-semibold my-2">Chart Preview</p>
        </div>
        <AreaProgress
          colors={[chartColor]}
          categoryNames={[progressName]}
          chartdata={chartData}
          idx={selectedRange}
          maxValue={maxValue}
        />
      </section>
    </Grid>
  );
};

export default ProgressApp;
