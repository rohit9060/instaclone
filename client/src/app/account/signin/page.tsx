import { CardWrapper, SignIn } from "@/components/auth";

function Page() {
  const footer = [
    {
      text: "forgot password?",
      href: "/account/password/forgot",
    },
    {
      text: "Do not have an account? Sign up",
      href: "/account/signup",
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
