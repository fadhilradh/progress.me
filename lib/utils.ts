import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChartDataRes, ChartsWithProgressResponse } from "@/types/api";
import { ChartData } from "@/types/chart";
import { Value } from "@radix-ui/react-select";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function serializeProgressReq(data: ChartData[]) {
  const ranges = ["daily", "weekly", "monthly", "yearly"],
    firstData = Object.keys(data[0]),
    rangeTypeIdx = firstData.findIndex((d) => ranges.indexOf(d) !== -1),
    rangeType = firstData[rangeTypeIdx],
    progressIndex = rangeTypeIdx === 0 ? 1 : 0,
    progressName = firstData[progressIndex];

  return data?.map((d, i) => ({
    range_value: d[rangeType],
    progress_value: Number(d[progressName]),
    progress_no: i + 1,
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

export function serializeResToProgress(res: ChartData[]) {
  const tes = res.map((r) => ({
    value: r.progress_value,
    id: r.progress_id,
    rangeVal: r.range_value,
  }));
  return tes;
}
