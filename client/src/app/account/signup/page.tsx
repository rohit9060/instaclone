import { CardWrapper, SignIn } from "@/components/auth";

function Page() {
  const footer = [
    {
      text: "forgot password?",
      href: "/account/password/forgot",
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
