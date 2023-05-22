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
import { chartColors, ChartData, ProgressChart } from "@/types/tremor";
import { MONTHS, WEEKS, YEARS } from "@/data/time";
import { v4 as uuidv4 } from "uuid";
import { api } from "@/lib/axios";
import { serializeProgressReq, serializeProgressRes } from "@/lib/utils";
import { useTypedSelector } from "@/store/store";
import { ChartsWithProgressResponse } from "@/types/api";

const rangeMapping: Record<string, any> = {
  month: MONTHS,
  year: YEARS,
  week: WEEKS,
};

const ProgressApp = () => {
  const { register, handleSubmit, control, getValues, setValue } = useForm(),
    [chartColor, setChartColor] = useState<string>(""),
    rangeData = useWatch({ control, name: "range" }),
    [progressName, setProgressName] = useState<string>(""),
    [progressValue, setProgressValue] = useState<number | null>(),
    [selectedRange, setSelectedRange] = useState<string>(""),
    [chartData, setChartData] = useState<ProgressChart>({
      id: null,
      data: [],
    }),
    [maxValue, setMaxValue] = useState<number>(0),
    [isCreatingChart, setIsCreatingChart] = useState<boolean>(false),
    user = useTypedSelector((state) => state.user),
    [userCharts, setUserCharts] = useState([]),
    [userRawCharts, setUserRawCharts] = useState<ChartsWithProgressResponse[] | []>([]);

  function addChart() {
    try {
      api.post("/progress", {
        id: uuidv4(),
        data: serializeProgressReq(chartData.data),
      });
    } catch (error) {
      alert(error);
    }
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
    getUserCharts()
    console.log(userCharts)
  }, [userCharts?.length]);

  function addProgress() {
    const newData = {
      [selectedRange]: rangeData,
      [progressName]: progressValue,
    };
    setChartData({
      data: !chartData ? [newData] : [...chartData?.data, newData],
    });
    setValue("range", "Select");
    setProgressValue(0);
    const maxValue = Math.max(
      ...chartData?.data.map((data) => data[progressName])
    );
    setMaxValue(maxValue);
    setIsCreatingChart(true);
  }

  return (
    <Grid className="gap-5" numCols={1} numColsLg={2}>
      <h2>Your Charts :</h2>
      {
        userCharts?.map((chart: any, idx : number) => {
          return (
              <AreaProgress
              key={userRawCharts[idx].chart_id}
                chartdata={userCharts[idx]}
                colors={["blue"]}
                idx={userRawCharts[idx].range_type}
                categoryNames={[userRawCharts[idx].progress_name]}
              />
          )
        })
      }
      {/* <PlaceholderCharts /> */}
      <section className="border border-gray-300 shadow-xl p-6 rounded-xl grid gap-y-5">
        <h4 className="text-2xl ">Add New Progress Chart</h4>
        <div className="flex justify-between items-center">
          <InputWithText
            disabled={isCreatingChart}
            value={progressName}
            onChange={setProgressName}
            label="Progress Name"
            placeholder="E.g. Weight lifted, courses completed, average daily expense"
          />
          {isCreatingChart && (
            <Button
              onClick={() => {
                setIsCreatingChart(false);
                setChartData({ id: null, data: [] });
                setProgressName("");
                setValue("range", "");
                setSelectedRange("");
              }}
              title="Reset data"
              variant="ghost"
            >
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
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
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
            <Label className="text-xl my-3">Input progress data :</Label>
            <Label className="capitalize -mb-1">{selectedRange}</Label>
            <Controller
              control={control}
              name="range"
              render={({ field: { onChange, value, ref } }) => {
                return (
                  <Select onValueChange={onChange} value={value}>
                    <SelectTrigger className="w-[180px]" ref={ref}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent {...register("range")}>
                      {rangeMapping[selectedRange]?.map((time: any) => (
                        <SelectItem
                          className="capitalize"
                          key={time.value}
                          value={time.value}
                        >
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }}
            />

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
          variant="secondary"
          onClick={addProgress}
        >
          Add Data
        </Button>
        <Button
          disabled={chartData?.data?.length < 2}
          variant="outline"
          onClick={addChart}
        >
          Add Progress Chart
        </Button>
      </section>
      <AreaProgress
        colors={[chartColor]}
        categoryNames={[progressName]}
        chartdata={chartData?.data}
        idx={selectedRange}
        maxValue={maxValue}
      />
    </Grid>
  );
};

export default ProgressApp;
