import DynamicChart from "@/components/DynamicChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { rangeMapping } from "@/data/time";
import { api } from "@/lib/axios";
import { serializeChartRes, serializeResToProgress } from "@/lib/utils";
import { ProgressData } from "@/types/api";
import { Range } from "@/types/chart";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/router";
import React from "react";

const ChartDetail = () => {
  const {
      query: { id },
    } = useRouter(),
    [rawChartData, setRawChartData] = React.useState<any>(null),
    [chartData, setChartData] = React.useState<any>(null),
    [progressValues, setProgressValues] = React.useState<any>(null),
    [isEdited, setIsEdited] = React.useState<boolean>(false),
    [editedValues, setEditedValues] = React.useState<any>([]),
    [availableRanges, setavailableRanges] = React.useState<any>(null),
    [selectedRanges, setSelectedRanges] = React.useState<any>(null);

  async function getChartByID() {
    try {
      const { data } = await api.get(`/charts/${id}`);
      setRawChartData(data);
      setChartData(serializeChartRes(data));
      setSelectedRanges(data.progress_data.map((p: any) => p?.range_value));
      setProgressValues(
        data.progress_data.sort(
          (a: any, b: any) => a.progress_no - b.progress_no
        )
      );
    } catch (e) {
      console.error(e);
    }
  }

  async function patchProgresses() {
    try {
      const { data } = await api.patch("/progresses", {
        progresses: editedValues,
      });
      alert("Updated");
      getChartByID();
    } catch (e) {
      console.error(e);
    } finally {
      setEditedValues([]);
    }
  }

  // React.useEffect(() => {
  //   setavailableRanges(rangeMapping?.[rawChartData?.range_type]);
  // }, [rawChartData?.range_type]);

  React.useEffect(() => {
    setavailableRanges(
      rangeMapping?.[rawChartData?.range_type]?.filter(
        (r: Range) => !selectedRanges?.includes(r?.value)
      )
    );
  }, [selectedRanges?.length, rawChartData?.range_type]);

  React.useEffect(() => {
    console.log(
      "🚀 ~ file: [id].tsx:14 ~ editedValues ~ editedValues:",
      editedValues
    );
  }, [editedValues]);

  React.useEffect(() => {
    if (id) getChartByID();
  }, [id]);

  function updateProgress(newVal: number | string, type: string, p: any) {
    setProgressValues(
      progressValues.map((pv: any) => {
        if (pv.progress_id === p.progress_id) {
          return {
            ...p,
            [type]: newVal,
            ...(type === "progress_no" && {
              range_value: rangeMapping?.[rawChartData?.range_type]?.find(
                (r: Range) => r?.value === newVal
              )?.label,
            }),
          };
        } else {
          return pv;
        }
      })
    );
    setEditedValues(
      editedValues.find((ev: any) => ev.progress_id === p.progress_id)
        ? editedValues.map((ev: any) => {
            if (ev.progress_id === p.progress_id) {
              return {
                ...ev,
                [type]: newVal,
                ...(type === "progress_no" && {
                  range_value: rangeMapping?.[rawChartData?.range_type]?.find(
                    (r: Range) => r?.value === newVal
                  )?.label,
                }),
              };
            } else {
              return ev;
            }
          })
        : [
            ...editedValues,
            {
              progress_id: p.progress_id,
              [type]: newVal,
              ...(type === "progress_no" && {
                range_value: rangeMapping?.[rawChartData?.range_type]?.find(
                  (r: Range) => r?.value === newVal
                )?.label,
              }),
            },
          ]
    );
  }

  return (
    <div className="px-2 py-5 sm:px-5">
      <DynamicChart
        chartType={rawChartData?.chart_type}
        barChartType={rawChartData?.bar_chart_type}
        key={rawChartData?.chart_id}
        chartdata={chartData?.sort(
          (a: ProgressData, b: ProgressData) =>
            Number(a?.progress_no) - Number(b?.progress_no)
        )}
        colors={[rawChartData?.chart_color]}
        idx={rawChartData?.range_type}
        categoryNames={[rawChartData?.progress_name]}
        chartId={rawChartData?.chart_id}
      />
      <h3 className="mt-8 mb-6 text-xl">Edit Your Progress</h3>
      <section className="mt-5 flex flex-col items-center sm:grid sm:grid-cols-2 place-items-center gap-3">
        {progressValues?.map((p: any) => {
          return (
            <div className="flex gap-x-3 w-full" key={p.progress_id}>
              <span className="flex w-full flex-col gap-y-2">
                <Label className="capitalize">
                  {rawChartData?.range_type.replace("ly", "")}
                </Label>
                <Select
                  onValueChange={(val: number) => {
                    updateProgress(val, "progress_no", p);
                    setIsEdited(true);
                  }}
                  value={p?.progress_no}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select range value" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRanges?.map((r: any) => (
                      <SelectItem
                        className="capitalize"
                        key={r.value}
                        value={r.value}
                      >
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </span>
              <span className="flex w-full flex-col gap-y-2">
                <Label>Progress Value</Label>
                <div className="flex gap-x-2">
                  <Input
                    type="number"
                    value={p.progress_value}
                    onChange={(e) => {
                      updateProgress(e.target.value, "progress_value", p);
                      setIsEdited(true);
                    }}
                  />
                </div>
              </span>
            </div>
          );
        })}
        <Button
          className="mt-3 col-span-2 sm:max-w-sm w-full"
          size="sm"
          disabled={!isEdited}
          onClick={patchProgresses}
        >
          Update Progress
        </Button>
      </section>
    </div>
  );
};

export default ChartDetail;
