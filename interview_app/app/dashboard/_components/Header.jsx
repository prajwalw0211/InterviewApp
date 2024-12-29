"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { router } from "next/navigation";
function Header() {
  const path = usePathname();
  const router = useRouter();

  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-sm">
      <Image
        src={"/InterviewPRO.svg"}
        width={160}
        height={100}
        alt="logo"
        priority
      />
      <ul className="hidden md:flex gap-6">
        <li
          onClick={() => router.replace("/dashboard")}
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer 
            ${path == "/dashboard" && "text-primary font-bold"}
        `}
        >
          Dashboard
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer
        ${path == "/dashboard/questions" && "text-primary font-bold"}
        `}
        >
          Questions
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path == "/dashboard/upgrade" && "text-primary font-bold"}
            `}
        >
          Upgrade
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer
            ${path == "/dashboard/howitworks" && "text-primary font-bold"}
            `}
        >
          How it Works
        </li>
      </ul>

      {isSignedIn ? (
        <UserButton />
      ) : (
        <div className="flex gap-4">
          <Link href="/sign-in">
            <Button className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-all">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-secondary text-primary py-2 px-4 rounded border border-primary hover:bg-primary hover:text-white transition-all">
              Sign Up
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
