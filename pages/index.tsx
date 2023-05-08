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
import { MONTHS, YEARS } from "@/data/time";
import PlaceholderCharts from "@/components/PlaceholderCharts";
import { ChartData } from "@/types/tremor";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";

const rangeMapping: Record<string, any> = {
  month: MONTHS,
  year: YEARS,
};

const Home: NextPage = () => {
  const { register, handleSubmit, control, getValues, setValue } = useForm();
  const rangeData = useWatch({ control, name: "range" });
  const [progressName, setProgressName] = useState<string>("");
  const [progressValue, setProgressValue] = useState<any>("");
  const [selectedRange, setSelectedRange] = useState<string>("");
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [maxValue, setMaxValue] = useState<number>(0);

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

      <main className="flex flex-col h-full">
        <div className="px-10 flex flex-col gap-y-4">
          <h1 className="text-3xl my-10 font-bold">↗ progress.me</h1>

          <Grid className="gap-5 mb-10" numCols={1} numColsLg={2}>
            <PlaceholderCharts />
            <section className="mb-10 grid gap-y-5">
              <h4 className="text-2xl mt-10">Add New Progress Chart</h4>
              <InputWithText
                value={progressName}
                onChange={setProgressName}
                label="Progress Name"
                placeholder="E.g. Weight lifted, courses completed, average daily expense"
              />
              <div className="grid w-full items-center gap-1.5 ">
                <Label>Track by</Label>
                <Select onValueChange={setSelectedRange} value={selectedRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={selectedRange} />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="day">Day</SelectItem> */}
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
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
                          <SelectItem key={time.value} value={time.value}>
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
              <Button variant="secondary" onClick={addProgress}>
                Add Data
              </Button>
              <Button
                disabled={chartData.length < 2}
                variant="outline"
                // onClick={addProgress}
              >
                Add Progress Chart
              </Button>
            </section>
            <AreaProgress
              colors={["cyan"]}
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
