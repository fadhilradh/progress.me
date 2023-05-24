import type { NextPage } from "next";
import Head from "next/head";

import { Button } from "@/components/ui/button";
import ProgressApp from "@/components/ProgressApp";
import Link from "next/link";
import { useTypedSelector } from "@/store/store";

const Home: NextPage = () => {
  const user = useTypedSelector((state) => state.user);

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
        <nav className="flex justify-between items-center py-2 sm:py-5">
          <h1 className="text-3xl font-bold">↗ progress.me</h1>
          {user.isLoggedIn ? (
            <></>
          ) : (
            <Link href="/login">
              <Button variant="outline">
                <p className="text-lg">Login</p>
              </Button>
            </Link>
          )}
        </nav>
        <ProgressApp />
      </div>
    </>
  );
};

export default Home;
