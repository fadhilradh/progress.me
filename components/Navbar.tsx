import { useTypedSelector } from "@/store/store";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  const user = useTypedSelector((state) => state.user);

  return (
    <nav className="flex justify-between items-center py-2 sm:py-5">
      <Link href="/">
        <h1 className="text-3xl font-bold">↗ progress.me</h1>
      </Link>
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
  );
};

export default Navbar;
