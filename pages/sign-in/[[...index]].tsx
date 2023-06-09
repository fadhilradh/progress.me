import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="w-full h-screen flex justify-center items-center">
      <SignIn />
    </main>
  );
}
