import { useRouter } from "next/router";
import React from "react";

const ChartDetail = () => {
  const {
    query: { id },
  } = useRouter();
  console.log("🚀 ~ file: [id].tsx:6 ~ ChartDetail ~ id:", id);
  return <div>{id}</div>;
};

export default ChartDetail;
