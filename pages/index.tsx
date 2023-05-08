import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import AreaProgress from "@/components/AreaProgress";
import { InputWithText } from "@/components/InputWithText";
import { Grid, SelectBox, SelectBoxItem } from "@tremor/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MONTHS, YEARS, WEEKS } from "@/data/time";
import PlaceholderCharts from "@/components/PlaceholderCharts";
import { Chart, ChartData, ColorOptions, chartColors } from "@/types/tremor";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2 } from "lucide-react";

const rangeMapping: Record<string, any> = {
  month: MONTHS,
  year: YEARS,
  week: WEEKS,
};

const Home: NextPage = () => {
  const { register, handleSubmit, control, getValues, setValue } = useForm();
  const rangeData = useWatch({ control, name: "range" });
  const [progressName, setProgressName] = useState<string>("");
  const [progressValue, setProgressValue] = useState<any>("");
  const [selectedRange, setSelectedRange] = useState<string>("");
  const [chartColor, setChartColor] = useState<ColorOptions | "">("");
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [maxValue, setMaxValue] = useState<number>(0);
  const [allCharts, setAllCharts] = useState<Chart[]>([]);
  const [isCreatingChart, setIsCreatingChart] = useState<boolean>(false);

  function addProgress() {
    const newData = {
      [selectedRange]: rangeData,
      [progressName]: progressValue,
    };
    setChartData([...chartData, newData]);
    setValue("range", "Select");
    setProgressValue("");
    const maxValue = Math.max(...chartData.map((data) => data[progressName]));
    setMaxValue(maxValue);
    setIsCreatingChart(true);
  }

  function addChart() {
    setAllCharts([...allCharts, chartData]);
    setIsCreatingChart(false);
  }

  return (
    <div className="bg-primary text-primary-foreground">
      <Head>
        <title>Progress.me</title>
        <meta
          name="description"
          content="Track all your progress in one place"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col h-full ">
        <div className="p-10 flex flex-col gap-y-4">
          <h1 className="text-3xl mb-10 font-bold">↗ progress.me</h1>

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
              <Button variant="secondary" onClick={addProgress}>
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
        </div>
      </main>
    </div>
  );
};

export default Home;
