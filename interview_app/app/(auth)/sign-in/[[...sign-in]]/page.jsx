"use client";
import { SignIn, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  // const router = useRouter();
  // const { isSignedIn } = useUser();

  // useEffect(() => {
  //   if (isSignedIn) {
  //     console.log('isSignedIn:', isSignedIn);
  //     router.push('/dashboard');
  //   }
  // }, [isSignedIn,router]);

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-center bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1637173682466-9c9a46ae79e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />

          <div className="hidden lg:relative lg:block lg:p-12">
            <a className="block text-white" href="/">
              <Image
                src={"interviewPRO.svg"}
                width={300}
                height={145}
                alt="logo"
              />
            </a>

            <h2 className="mt-6 text-2xl font-bold text-muted sm:text-3xl md:text-4xl">
              Welcome to InterviewPro
            </h2>

            <p className="mt-1 leading-relaxed text-muted">
              Enhance Your Interview Skills, One Question at a Time.
            </p>
          </div>
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <SignIn />
        </main>
      </div>
    </section>
  );
}
