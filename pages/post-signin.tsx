import { useUser } from "@clerk/nextjs";
import { api } from "@/lib/axios";
import { useTypedDispatch } from "@/store/store";
import { login } from "@/store/user";
import { useRouter } from "next/router";
import React from "react";

export default function Page() {
  const dispatch = useTypedDispatch();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoaded && user?.id) {
      const userId = user.id;

      async function postUser() {
        try {
          await api.post(`/users`, {
            id: userId,
            username: user?.fullName,
            email: user?.emailAddresses[0]?.emailAddress,
            role: "user",
          });
          console.log("User posted to DB");
          router.push("/app");
        } catch (e) {
          console.error(e);
          // Handle error, maybe redirect to an error page or show a message
          router.push("/app"); // Still redirect to app for now even on error
        }
      }
      postUser();
    } else if (isLoaded && !user) {
      // If not logged in after loading, redirect to sign-in
      router.push("/sign-in");
    }
  }, [isLoaded, user, dispatch, router]);

  return null;
}
