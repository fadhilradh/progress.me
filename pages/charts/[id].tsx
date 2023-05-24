import DynamicChart from "@/components/DynamicChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";
import { serializeChartRes, serializeResToProgress } from "@/lib/utils";
import { ProgressData } from "@/types/api";
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
    [editedValues, setEditedValues] = React.useState<any>([]);

  async function getChartByID() {
    try {
      const { data } = await api.get(`/charts/${id}`);
      setRawChartData(data);
      setChartData(serializeChartRes(data));
      setProgressValues(serializeResToProgress(data.progress_data));
    } catch (e) {
      console.error(e);
    }
  }

  // React.useEffect(() => {
  //   console.log(
  //     "🚀 ~ file: [id].tsx:14 ~ ChartDetail ~ chartData:",
  //     editedValues
  //   );
  // }, [editedValues]);

  React.useEffect(() => {
    if (id) getChartByID();
  }, [id]);

  function updateProgress(
    e: React.ChangeEvent<HTMLInputElement>,
    type: string,
    p: any
  ) {
    setProgressValues(
      progressValues.map((pv: any) => {
        if (pv.id === p.id) {
          return {
            ...p,
            [type]: e.target.value,
          };
        } else {
          return pv;
        }
      })
    );
    setEditedValues(
      editedValues.find((ev: any) => ev.id === p.id)
        ? editedValues.map((ev: any) => {
            if (ev.id === p.id) {
              return {
                ...ev,
                [type]: e.target.value,
              };
            } else {
              return ev;
            }
          })
        : [...editedValues, { id: p.id, [type]: e.target.value }]
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
        {progressValues?.map((p: any) => (
          <div className="flex gap-x-3 w-full" key={p.id}>
            <span className="flex w-full flex-col gap-y-2">
              <Label className="capitalize">
                {rawChartData.range_type.replace("ly", "")}
              </Label>
              <div className="flex gap-x-2">
                <Input
                  value={p.rangeVal}
                  onChange={(e) => {
                    updateProgress(e, "rangeVal", p);
                    setIsEdited(true);
                  }}
                />
              </div>
            </span>
            <span className="flex w-full flex-col gap-y-2">
              <Label>Progress Value</Label>
              <div className="flex gap-x-2">
                <Input
                  type="number"
                  value={p.value}
                  onChange={(e) => {
                    updateProgress(e, "value", p);
                    setIsEdited(true);
                  }}
                />
              </div>
            </span>
          </div>
        ))}
        <Button
          className="mt-3 col-span-2 sm:max-w-sm w-full"
          size="sm"
          disabled={!isEdited}
        >
          Update Progress
        </Button>
      </section>
    </div>
  );
};

export default ChartDetail;
