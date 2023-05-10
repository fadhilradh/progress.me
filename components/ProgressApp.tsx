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
import { Chart, chartColors, ChartData, ColorOptions } from "@/types/tremor";
import { MONTHS, WEEKS, YEARS } from "@/data/time";

const rangeMapping: Record<string, any> = {
  month: MONTHS,
  year: YEARS,
  week: WEEKS,
};

const ProgressApp = () => {
  const { register, handleSubmit, control, getValues, setValue } = useForm(),
    [chartColor, setChartColor] = useState<ColorOptions | "">(""),
    rangeData = useWatch({ control, name: "range" }),
    [progressName, setProgressName] = useState<string>(""),
    [progressValue, setProgressValue] = useState<number>(),
    [selectedRange, setSelectedRange] = useState<string>(""),
    [chartData, setChartData] = useState<ChartData[]>([]),
    [maxValue, setMaxValue] = useState<number>(0),
    [allCharts, setAllCharts] = useState<Chart[]>([]),
    [isCreatingChart, setIsCreatingChart] = useState<boolean>(false);

  function addChart() {
    setAllCharts([...allCharts, chartData]);
    setIsCreatingChart(false);
  }

  function addProgress() {
    const newData = {
      [selectedRange]: rangeData,
      [progressName]: progressValue,
    };
    setChartData([...chartData, newData]);
    setValue("range", "Select");
    setProgressValue(0);
    const maxValue = Math.max(...chartData.map((data) => data[progressName]));
    setMaxValue(maxValue);
    setIsCreatingChart(true);
  }

  return (
    <Grid className="gap-5" numCols={1} numColsLg={2}>
      <PlaceholderCharts />
      <section className="p-4 rounded-xl border border-primary-foreground grid gap-y-5">
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
                setChartData([]);
                setProgressName("");
                setValue("range", "");
                setSelectedRange("");
              }}
              title="Reset this progress"
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
        <Label className="text-xl mt-3">Input your progress data :</Label>
        <Label className="capitalize -mb-5">{selectedRange}</Label>

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
        <div className="grid w-full items-center gap-1.5 ">
          <Label>Chart Color</Label>
          <Select onValueChange={setChartColor} value={chartColor}>
            <SelectTrigger className="w-[180px]">
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
        <Button
          disabled={chartData.length === 0}
          variant="secondary"
          onClick={addProgress}
        >
          Add Data
        </Button>
        <Button
          disabled={chartData.length < 2}
          variant="outline"
          onClick={addChart}
        >
          Add Progress Chart
        </Button>
      </section>
      <AreaProgress
        colors={[chartColor]}
        categoryNames={[progressName]}
        chartdata={chartData}
        idx={selectedRange}
        maxValue={maxValue}
      />
    </Grid>
  );
};

export default ProgressApp;
