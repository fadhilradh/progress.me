export type ChartData = Record<string, string | number>;

export interface Range {
  label: string;
  value: any;
}

export type Chart = ChartData[];

export type ChartColorOptions =
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose";

export type ChartType = "bar" | "line" | "area";
export type BarChartType = "horizontal" | "vertical";
