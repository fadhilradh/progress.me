import type { NextPage } from "next";
import Head from "next/head";

import ProgressApp from "@/components/ProgressApp";
import Navbar from "@/components/Navbar";
import React from "react";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Progress Hub</title>
        <meta
          name="description"
          content="Track all your progress in one place"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="px-2 sm:px-10 pb-10 flex flex-col h-full gap-y-4">
        <Navbar />
        <ProgressApp />
      </div>
    </>
  );
};

export default Home;
