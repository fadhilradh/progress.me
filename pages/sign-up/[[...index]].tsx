import { SignUp, useSignUp } from "@clerk/nextjs";
import React from "react";

export default function Page() {
  const { isLoaded, signUp } = useSignUp();

  React.useEffect(() => {
    console.log(
      "🚀 ~ file: [[...index]].tsx:10 ~ Page ~ signUp?.status:",
      signUp?.status
    );
  }, [signUp?.status]);

  if (!isLoaded) {
    // Handle loading state
    return null;
  }

  return (
    <main className="w-full h-screen flex justify-center items-center">
      <SignUp />
    </main>
  );
}
