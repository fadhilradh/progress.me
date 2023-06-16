import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center py-2 sm:py-5">
      <Link href="/">
        <h1 className="text-3xl font-bold">↗ progress.me</h1>
      </Link>
      <UserButton afterSignOutUrl="/" />
    </nav>
  );
};

export default Navbar;
