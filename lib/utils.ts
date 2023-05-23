import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChartsWithProgressResponse } from "@/types/api";
import { ChartData } from "@/types/chart";

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
    return d.progress_data.map((p, idx) => ({
      [d.progress_name]: p.progress_value,
      [d.range_type]: p.range_value,
      progress_no: p.progress_no,
    }));
  });
}
