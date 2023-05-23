export type ChartData = Record<string, string | number>;

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
