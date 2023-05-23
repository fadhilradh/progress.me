import {
  booksRead,
  dailyExpense,
  mySideBusinessIncome,
  myWeight,
  screenTime,
  totalProjects,
} from "@/data/dummy";
import React from "react";
import DynamicChart from "./DynamicChart";

const PlaceholderCharts = () => {
  return (
    <>
      {/* <DynamicChart
        colors={["blue"]}
        categoryNames={["My Personal Coding Projects Count"]}
        chartdata={totalProjects}
      /> */}
      <DynamicChart
        colors={["orange"]}
        categoryNames={["Total Books Read"]}
        chartdata={booksRead}
      />
      <DynamicChart
        colors={["fuchsia"]}
        categoryNames={["Average Daily Food Expense (IDR)"]}
        chartdata={dailyExpense}
      />
      <DynamicChart
        colors={["indigo", "cyan"]}
        categoryNames={["Online Shop (IDR)", "Dropshipping (IDR)"]}
        chartdata={mySideBusinessIncome}
      />
      {/* <DynamicChart
        colors={["purple"]}
        categoryNames={["My Weight (kg)"]}
        chartdata={myWeight}
      /> */}

      <DynamicChart
        colors={["green"]}
        categoryNames={["My Average Phone Screen Time (hour)"]}
        chartdata={screenTime}
      />
    </>
  );
};

export default PlaceholderCharts;
