import type { GetServerSideProps } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { api } from "@/lib/axios";
import React from "react";
import { useTypedDispatch } from "@/store/store";
import { login } from "@/store/user";

type Repo = {
  name: string;
  stargazers_count: number;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);

  try {
    await api.post(`/users/${userId}`);
    console.log("User posted to DB");
  } catch (e) {
    console.error(e);
  }

  return {
    props: {
      userId,
    },
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};

export default function Page({ userId }: { userId: string }) {
  const dispatch = useTypedDispatch();
  dispatch(login({ userId }));

  return null;
}
