import { ChartData, ProgressChart } from "@/types/tremor";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
