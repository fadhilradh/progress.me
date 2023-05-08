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
      <AreaProgress
        colors={["blue"]}
        categoryNames={["My Personal Coding Projects Count"]}
        chartdata={totalProjects}
      />
      <AreaProgress
        colors={["red"]}
        categoryNames={["My Average Daily Expense"]}
        chartdata={dailyExpense}
      />
      <AreaProgress
        colors={["indigo", "cyan"]}
        categoryNames={["Online Shop", "Dropshipping"]}
        chartdata={mySideBusinessIncome}
      />
      <AreaProgress
        colors={["purple"]}
        categoryNames={["My Weight (kg)"]}
        chartdata={myWeight}
      />
      <AreaProgress
        colors={["orange"]}
        categoryNames={["Total Books Read"]}
        chartdata={booksRead}
      />
      <AreaProgress
        colors={["cyan"]}
        categoryNames={["My Average Phone Screen Time (hour)"]}
        chartdata={screenTime}
      />
    </>
  );
};

export default PlaceholderCharts;
