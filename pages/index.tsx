import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import AreaProgress from "@/components/AreaProgress";

const totalProjects = [
  {
    month: "Feb",
    "My Personal Coding Projects Count": 1,
  },
  {
    month: "March",
    "My Personal Coding Projects Count": 2,
  },
  {
    month: "April",
    "My Personal Coding Projects Count": 3,
  },
  {
    month: "May",
    "My Personal Coding Projects Count": 9,
  },
];

const dailyExpense = [
  {
    month: "Feb",
    "My Average Daily Expense": 50000,
  },
  {
    month: "March",
    "My Average Daily Expense": 40000,
  },
  {
    month: "April",
    "My Average Daily Expense": 20000,
  },
  {
    month: "May",
    "My Average Daily Expense": 15000,
  },
];

const screenTime = [
  {
    month: "Feb",
    "My Average Phone Screen Time (hour)": 3.5,
  },
  {
    month: "March",
    "My Average Phone Screen Time (hour)": 3.1,
  },
  {
    month: "April",
    "My Average Phone Screen Time (hour)": 2.6,
  },
  {
    month: "May",
    "My Average Phone Screen Time (hour)": 2.0,
  },
];

const myWeight = [
  {
    month: "January",
    "My Weight (kg)": 74,
  },
  {
    month: "February",
    "My Weight (kg)": 73,
  },
  {
    month: "March",
    "My Weight (kg)": 71,
  },
  {
    month: "April",
    "My Weight (kg)": 68,
  },
  {
    month: "May",
    "My Weight (kg)": 68,
  },
];

const booksRead = [
  {
    month: "January",
    "Total Books Read": 1,
  },
  {
    month: "February",
    "Total Books Read": 2,
  },
  {
    month: "March",
    "Total Books Read": 3,
  },
  {
    month: "April",
    "Total Books Read": 4,
  },
  {
    month: "May",
    "Total Books Read": 5,
  },
];

const Home: NextPage = () => {
  const [hobbies, setHobbies] = useState([]);

  useEffect(() => {}, []);

  return (
    <div className="bg-primary text-primary-foreground">
      <Head>
        <title>Progress.me</title>
        <meta
          name="description"
          content="Track all your progress in one place"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col h-full">
        <div className="px-10 flex flex-col gap-y-4">
          <h1>My Progress</h1>
          <AreaProgress
            colors={["blue"]}
            categoryName={["My Personal Coding Projects Count"]}
            chartdata={totalProjects}
          />
          <AreaProgress
            colors={["red"]}
            categoryName={["My Average Daily Expense"]}
            chartdata={dailyExpense}
          />
          <AreaProgress
            colors={["purple"]}
            categoryName={["My Weight (kg)"]}
            chartdata={myWeight}
          />
          <AreaProgress
            colors={["orange"]}
            categoryName={["Total Books Read"]}
            chartdata={booksRead}
          />
          <AreaProgress
            colors={["cyan"]}
            categoryName={["My Average Phone Screen Time (hour)"]}
            chartdata={screenTime}
          />
          <ul className="grid grid-cols-4 gap-3"></ul>
        </div>
      </main>
    </div>
  );
};

export default Home;
