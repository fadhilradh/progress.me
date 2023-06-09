import { UserButton } from "@clerk/nextjs";
import axios from "axios";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  async function getAuthData() {
    try {
      const userData = await axios.get("/api/auth");
      console.log(
        "🚀 ~ file: Navbar.tsx:10 ~ getUserData ~ userData:",
        userData
      );
    } catch (error) {}
  }

  React.useEffect(() => {
    getAuthData();
  }, []);

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
