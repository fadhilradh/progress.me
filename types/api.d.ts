import { UUID } from "crypto";
import { BarChartType, ChartColorOptions, ChartType } from "./chart";

export interface ChartsWithProgressResponse {
  chart_id: UUID;
  range_type: string;
  progress_name: string;
  progress_data: ProgressData[];
  chart_color: string;
  chart_type: ChartType;
  bar_chart_type: BarChartType;
}

export interface ProgressData {
  progress_id: UUID;
  progress_value: number;
  range_value: string;
  progress_no: number;
}

export interface ChartDataRes {
  chart_id: UUID;
  chart_color: ChartColorOptions;
  chart_type: ChartType;
  bar_chart_type: BarChartType;
  range_type: string;
  progress_name: string;
  progress_data: ProgressData[];
}
