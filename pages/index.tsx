import type { NextPage } from "next";
import Head from "next/head";

import { Button } from "@/components/ui/button";
import ProgressApp from "@/components/ProgressApp";

const Home: NextPage = () => {
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

      <main className="flex flex-col h-full ">
        <div className="px-10 pb-10 flex flex-col gap-y-4">
          <div className="flex justify-between items-center py-5">
            <h1 className="text-3xl  font-bold">↗ progress.me</h1>
            <Button variant="outline">
              <p className="text-lg">Login</p>
            </Button>
          </div>
          <ProgressApp />
        </div>
      </main>
    </div>
  );
};

export default Home;
