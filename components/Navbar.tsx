import { SignedOut, UserButton, SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center py-2 sm:py-5">
      <Link href="/">
        <h1 className="text-3xl font-bold">↗ progress.me</h1>
      </Link>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <SignedOut>
        <Button>
          <SignInButton />
        </Button>
      </SignedOut>
    </nav>
  );
};

export default Navbar;
