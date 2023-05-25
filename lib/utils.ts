import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChartDataRes, ChartsWithProgressResponse } from "@/types/api";
import { ChartData } from "@/types/chart";
import { Value } from "@radix-ui/react-select";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function serializeProgressReq(data: ChartData[]) {
  return data?.map((d, i) => ({
    range_value: d.range_value,
    progress_value: Number(d.progress_value),
    progress_no: d.progress_no,
  }));
}

export function serializeProgressRes(data: any) {
  return data?.map((d: ChartsWithProgressResponse, i: number) => {
    return d.progress_data.map((p) => ({
      [d.progress_name]: p.progress_value,
      [d.range_type]: p.range_value,
      progress_no: p.progress_no,
    }));
  });
}

export function serializeChartRes(d: ChartDataRes) {
  return d.progress_data.map((p) => ({
    [d.progress_name]: p.progress_value,
    [d.range_type]: p.range_value,
    progress_no: p.progress_no,
    id: p.progress_id,
  }));
}
