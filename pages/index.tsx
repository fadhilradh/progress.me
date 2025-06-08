import { Button } from "@/components/ui/button";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const Landing: NextPage = () => {
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
      <div className="min-h-screen h-full p-2 flex flex-col bg-gradient-to-br from-sky-300 via-blue-500 to-blue-800">

        <div className="flex flex-col items-center justify-center flex-grow text-center px-4">
          <h1 className="text-white text-5xl font-extrabold mb-6 drop-shadow-xl">
            Progress Hub
          </h1>
          <p className="text-xl text-white mb-10 max-w-2xl drop-shadow-lg">
            Your ultimate companion for tracking every milestone. Achieve your
            goals with clarity and motivation.
          </p>

          <div className="p-4 mb-10">
          <Link href="/app" passHref>
            <Button size="lg" className="shadow-white">
              Try Now
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mb-10">
          <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105">
            <h2 className="text-2xl font-bold text-indigo-700 mb-3">Intuitive Tracking</h2>
            <p className="text-gray-700">
              Effortlessly log your progress for any goal, from fitness to learning.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105">
            <h2 className="text-2xl font-bold text-indigo-700 mb-3">Visual Insights</h2>
            <p className="text-gray-700">
              See your journey unfold with beautiful charts and data visualizations.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105">
            <h2 className="text-2xl font-bold text-indigo-700 mb-3">Stay Motivated</h2>
            <p className="text-gray-700">
              Celebrate your achievements and stay inspired to push further.
            </p>
          </div>
        </div>
          <Image src="/static/preview.png" alt="Progress Hub Preview" width={1000} height={1000} className="mb-4" />
          <Image src="/static/saved-charts.png" alt="Progress Hub Preview" width={1000} height={1000} />

        </div>
      </div>
    </>
  );
};

export default Landing; 