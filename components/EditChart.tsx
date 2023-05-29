import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { chartColors } from "@/data/chart";
import { ChartColorOptions } from "@/types/chart";
import { api } from "@/lib/axios";
import { UUID } from "crypto";

const formSchema = z.object({
  progress_name: z.string().min(2).max(50),
  chart_type: z.string().min(2).max(50),
  chart_color: z.string().min(2).max(50),
});

interface IEditChartProps {
  chartData: any;
  getChart: () => void;
  chartId: UUID;
}

export function EditChart({ chartData, getChart, chartId }: IEditChartProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      progress_name: "",
      chart_type: "",
      chart_color: "",
    },
  });

  React.useEffect(() => {
    form.reset({
      progress_name: chartData?.progress_name,
      chart_type: chartData?.chart_type,
      chart_color: chartData?.chart_color,
    });
  }, [chartData]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await api.patch(`/charts/${chartId}`, {
        ...values,
      });
      alert("Updated");
      getChart();
    } catch (e) {
      console.error(e);
    }

    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-6 px-4"
      >
        <h3 className="mt-8 mb-2 text-xl">Edit Your Chart</h3>
        <div className="flex gap-x-8 justify-between sm:justify-normal">
          <FormField
            control={form.control}
            name="progress_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chart Name</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="chart_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chart Type</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[100px] sm:w-[250px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {/* TODO : support date */}
                      {/* <SelectItem value="date">Date</SelectItem> */}
                      <SelectItem value="bar">Bar</SelectItem>
                      <SelectItem value="area">Area</SelectItem>
                      <SelectItem value="line">Line</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="chart_color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chart Color</FormLabel>
              <FormControl>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger className="sm:w-[250px]">
                    <SelectValue />
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="self-center mt-6">
          Update Chart
        </Button>
      </form>
    </Form>
  );
}

export default EditChart;
