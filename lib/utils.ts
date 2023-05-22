import { ChartData, ProgressChart } from "@/types/tremor";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {ChartsWithProgressResponse} from "@/types/api"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function serializeProgressReq(data: ChartData[]) {
  const ranges = ["day", "week", "month", "year"],
    firstData = Object.keys(data[0]),
    rangeTypeIdx = firstData.findIndex((d) => ranges.indexOf(d) !== -1),
    rangeType = firstData[rangeTypeIdx],
    progressIndex = rangeTypeIdx === 0 ? 1 : 0,
    progressName = firstData[progressIndex];

  return data?.map((d) => ({
    range_type: rangeType,
    range_value: d[rangeType],
    progress_name: progressName,
    progress_value: Number(d[progressName]),
  }));
}

export function serializeProgressRes(data: any) {
    return data?.map((d : ChartsWithProgressResponse, i :number) => {
        return d.progress_data.map((p) => ({
        [d.progress_name]: p.progress_value,
        [d.range_type]: p.range_value,
      }))
    })
}
