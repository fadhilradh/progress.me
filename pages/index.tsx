import type { NextPage } from "next";
import Head from "next/head";

import ProgressApp from "@/components/ProgressApp";
import Navbar from "@/components/Navbar";
import axios from "axios";
import React from "react";

const Home: NextPage = () => {
  const [userData, setUserData] = React.useState<any>(null);

  async function getAuthData() {
    try {
      const { data } = await axios.get("/api/auth");
      setUserData(data.userData);
    } catch (error) {}
  }

  React.useEffect(() => {
    getAuthData();
  }, []);

  return (
    <>
      <Head>
        <title>Progress.me</title>
        <meta
          name="description"
          content="Track all your progress in one place"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="px-2 sm:px-10 pb-10 flex flex-col h-full gap-y-4">
        <Navbar userData={userData} />
        <ProgressApp userData={userData} />
      </div>
    </>
  );
};

export default Home;
