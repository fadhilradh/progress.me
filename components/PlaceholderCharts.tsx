import {
  booksRead,
  dailyExpense,
  mySideBusinessIncome,
  myWeight,
  screenTime,
  totalProjects,
} from "@/data/dummy";
import React from "react";
import AreaProgress from "./AreaProgress";

const PlaceholderCharts = () => {
  return (
    <>
      {/* <AreaProgress
        colors={["blue"]}
        categoryNames={["My Personal Coding Projects Count"]}
        chartdata={totalProjects}
      /> */}
      <AreaProgress
        colors={["orange"]}
        categoryNames={["Total Books Read"]}
        chartdata={booksRead}
      />
      <AreaProgress
        colors={["fuchsia"]}
        categoryNames={["Average Daily Food Expense (IDR)"]}
        chartdata={dailyExpense}
      />
      <AreaProgress
        colors={["indigo", "cyan"]}
        categoryNames={["Online Shop (IDR)", "Dropshipping (IDR)"]}
        chartdata={mySideBusinessIncome}
      />
      {/* <AreaProgress
        colors={["purple"]}
        categoryNames={["My Weight (kg)"]}
        chartdata={myWeight}
      /> */}

      <AreaProgress
        colors={["green"]}
        categoryNames={["My Average Phone Screen Time (hour)"]}
        chartdata={screenTime}
      />
    </>
  );
};

export default PlaceholderCharts;
