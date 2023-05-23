export type ChartData = Record<string, number | string>;
export interface ProgressChart {
  id?: string | null;
  data: ChartData[];
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
