import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);
  console.log(
    "🚀 ~ file: post-signup.tsx:11 ~ constgetServerSideProps:GetServerSideProps= ~ userId:",
    userId
  );

  // Load any data your application needs for the page using the userId
  return { props: { userId } };
};

export default function PostSignup({
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <div>{userId}</div>;
}
