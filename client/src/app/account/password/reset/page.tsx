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
      <CardWrapper cardFooter={footer}>
        <SignIn />
      </CardWrapper>
    </>
  );
}

export default Page;
