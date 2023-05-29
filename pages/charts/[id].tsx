import DynamicChart from "@/components/DynamicChart";
import EditChart from "@/components/EditChart";
import Navbar from "@/components/Navbar";
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
import { serializeChartRes } from "@/lib/utils";
import { ProgressData } from "@/types/api";
import { Range } from "@/types/chart";
import { UUID } from "crypto";
import { TrashIcon } from "lucide-react";
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
    [selectedRanges, setSelectedRanges] = React.useState<any>(null),
    [isAddingProgress, setIsAddingProgress] = React.useState<boolean>(false);

  async function getChartByID() {
    try {
      const { data } = await api.get(`/charts/${id}`);
      setRawChartData(data);
      if (data?.progress_data?.length > 0) {
        setChartData(serializeChartRes(data));
        setSelectedRanges(data.progress_data.map((p: any) => p?.range_value));
        setProgressValues(
          data.progress_data.sort(
            (a: any, b: any) => a.progress_no - b.progress_no
          )
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function patchProgresses() {
    try {
      await api.patch("/progresses", {
        progresses: editedValues,
      });
      alert("Updated");
      getChartByID();
    } catch (e) {
      console.error(e);
    } finally {
      setEditedValues([]);
      setIsEdited(false);
    }
  }

  async function deleteProgress(id: UUID) {
    try {
      await api.delete(`/progresses/${id}`);
      alert("Deleted");
      getChartByID();
    } catch (e) {
      console.error(e);
    }
  }

  React.useEffect(() => {
    setavailableRanges(
      rangeMapping?.[rawChartData?.range_type]?.filter(
        (r: Range) => !selectedRanges?.includes(r?.value)
      )
    );
  }, [selectedRanges?.length, rawChartData?.range_type]);

  React.useEffect(() => {
    if (id) getChartByID();
  }, [id]);

  function updateProgress(newVal: number | string, type: string, p: any) {
    setProgressValues(
      progressValues.map((pv: any) => {
        if (pv.progress_id === p.progress_id) {
          return {
            ...p,
            [type]: type == "progress_value" ? Number(newVal) : newVal,
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
                [type]: type == "progress_value" ? Number(newVal) : newVal,
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
              [type]: type == "progress_value" ? Number(newVal) : newVal,
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
    <div className="px-2 pb-8 sm:px-8">
      <Navbar />
      <DynamicChart
        editable={false}
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

      <h3 className="mt-8 mb-6 text-xl">Edit Your Chart</h3>

      <EditChart chartData={rawChartData} />

      {progressValues?.length > 0 && (
        <h3 className="mt-8 mb-6 text-xl">Edit Your Progress</h3>
      )}
      {progressValues?.length > 0 ? (
        <section className="mt-5 flex flex-col items-center sm:grid sm:grid-cols-2 place-items-center gap-3">
          {progressValues?.map((p: any) => {
            return (
              <div
                className="flex items-center gap-x-3 w-full p-3 hover:bg-slate-100 rounded-lg"
                key={p.progress_id}
              >
                <span className="flex w-full flex-col gap-y-2">
                  <Label className="capitalize">
                    {rawChartData?.range_type.replace("ly", "")}
                  </Label>
                  <Select
                    /* @ts-ignore */
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
                      type="text"
                      pattern="[0-9]*"
                      value={p.progress_value}
                      onChange={(e) => {
                        updateProgress(e.target.value, "progress_value", p);
                        setIsEdited(true);
                      }}
                    />
                  </div>
                </span>
                <div
                  role="button"
                  onClick={() => deleteProgress(p.progress_id)}
                  className="cursor-pointer flex-shrink-0 p-2 rounded-full bg-slate-300 hover:opacity-70"
                >
                  <TrashIcon size={13} />
                </div>
              </div>
            );
          })}

          <Button
            className="mt-3 col-span-2 "
            disabled={!isEdited}
            onClick={patchProgresses}
          >
            Update Progress
          </Button>
        </section>
      ) : (
        <p className="text-center mt-10">
          Your chart has no progress. Add more to see your chart.
        </p>
      )}
    </div>
  );
};

export default ChartDetail;
