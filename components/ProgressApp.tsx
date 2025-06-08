import React, { useState } from "react";
import DynamicChart from "@/components/DynamicChart";
import { Grid } from "@tremor/react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { ChartData } from "@/types/chart";
import { api } from "@/lib/axios";
import { serializeProgressRes } from "@/lib/utils";
import { ChartsWithProgressResponse } from "@/types/api";
import axios from "axios";
import ChartCreationForm from "@/components/ChartCreationForm";
import { useUser } from "@clerk/nextjs";


const ProgressApp = () => {
  const [userCharts, setUserCharts] = useState<ChartData[][]>([]),
    [userRawCharts, setUserRawCharts] = useState<
      ChartsWithProgressResponse[] | []
    >([]),
    [isChartFormOpen, setIsChartFormOpen] = useState<boolean>(false)

    const [userData, setUserData] = React.useState<any>(null);
    const {user} = useUser()

    React.useEffect(() => {
      console.log("useUser :", user);
      if (user?.id) {
        getUserCharts();
      }
    }, [user]);


  async function getUserCharts() {
    try {
      const res = await api.get(`/chart-progresses/${user?.id}`);
      setUserRawCharts(res.data);
      setUserCharts(serializeProgressRes(res.data));
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="w-full grid gap-5">
      {isChartFormOpen && (
        <ChartCreationForm
          userId={user?.id}
          getUserCharts={getUserCharts}
          setIsChartFormOpen={setIsChartFormOpen}
          userData={userData}
        />
      )}

      {!isChartFormOpen && (
        <section className="h-[200px] w-full flex justify-center items-center">
          <Button
            onClick={() => setIsChartFormOpen(true)}
            className="flex gap-x-2 items-center"
          >
            <Plus />
            Add New Chart
          </Button>
        </section>
      )}
      {userCharts.length > 0 && (
        <h1 className=" text-center text-2xl font-bold text-blue-600 drop-shadow-lg">Your Progress Charts</h1>
      )}
      <Grid className="gap-5" numCols={1} numColsLg={2}>
        {userCharts?.map((chart: any, idx: number) => {
          const currentChart = userRawCharts[idx];
          return (
            <DynamicChart
              editable
              chartType={currentChart.chart_type}
              barChartType={currentChart.bar_chart_type}
              key={currentChart.chart_id}
              chartdata={userCharts[idx].sort(
                (a, b) => Number(a.progress_no) - Number(b.progress_no)
              )}
              colors={[currentChart.chart_color]}
              idx={currentChart.range_type}
              categoryNames={[currentChart.progress_name]}
              chartId={currentChart.chart_id}
            />
          );
        })}
      </Grid>
    </div>
  );
};

export default ProgressApp;
