import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login } from "../store/user";

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = useState({ message: "" });
  const router = useRouter();

  async function onFormSubmit(data: any) {
    try {
      setError({ message: "" });
      setIsLoading(true);
      const userData = await api.post("/login", data);
      reset();
      dispatch(login(userData.data));
      // router.replace("/");
    } catch (error) {
      console.log(error);
      setError({ message: error.response.data.message });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center pt-20">
        <h1 className="bg-gradient-to-r pb-2 from-blue-600 to-green-300 bg-clip-text text-4xl font-bold text-transparent">
          Login
        </h1>
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex w-full flex-col items-center justify-center gap-4 px-4 pt-10 sm:w-1/2"
        >
          <div className="flex flex-col gap-y-1">
            <label className="text-sm " htmlFor="email">
              Username
            </label>
            <Input
              id="email"
              className="w-56"
              {...register("username")}
              placeholder="Enter your username"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <label className="text-sm " htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              className="w-56"
              {...register("password")}
              placeholder="Enter your password"
            />
          </div>
          <p className="text-red-500">{error && error.message}</p>
          <Button size="lg" isLoading={isLoading} className="text-lg mt-2">
            Login
          </Button>
          <p className="text-sm">
            Don`&apos;`t have an account ?
            <Link className="underline hover:text-blue-500" href="/register">
              Click here to register
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
