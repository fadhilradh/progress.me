import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import React from "react";
import { useTypedDispatch } from "@/store/store";
import { login } from "@/store/user";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);

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
