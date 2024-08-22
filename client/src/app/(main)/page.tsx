"use client";
import { CardWrapper, SignIn } from "@/components/auth";

function Page() {
  const footer = [
    {
      text: "Do not have an account? Sign up",
      href: "/account/signup",
    },
    {
      text: "Already have an account? Sign in",
      href: "/account/signin",
    },
  ];

  return (
    <>
      <section className="flex flex-col justify-center items-center h-screen max-w-4xl mx-auto px-5 text-center gap-5 ">
        <CardWrapper cardFooter={footer}>
          <SignIn />
        </CardWrapper>
      </section>
    </>
  );
}

export default Page;
