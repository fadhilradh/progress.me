export type ChartData = Record<string, number | string>;
export type ChartDataWithLabel = Record<
  string,
  number | string | { label: string }
>;

export interface ProgressChart {
  id?: string | null;
  data: ChartDataWithLabel[];
}

export interface Range {
  label: string;
  value: number;
}

export type Chart = ChartData[];

export type ColorOptions =
  | (
      | "blue"
      | "red"
      | "purple"
      | "orange"
      | "slate"
      | "gray"
      | "zinc"
      | "neutral"
      | "stone"
      | "amber"
      | "yellow"
      | "lime"
      | "green"
      | "emerald"
      | "teal"
      | "cyan"
      | "sky"
      | "indigo"
      | "violet"
      | "fuchsia"
      | "pink"
      | "rose"
    )[]
  | undefined;

export const chartColors = [
  "blue",
  "red",
  "purple",
  "orange",
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "indigo",
  "violet",
  "fuchsia",
  "pink",
  "rose",
] as ColorOptions;
