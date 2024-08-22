import { SwitchTheme } from "@/components/shared";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export function CardWrapper({
  children,
  cardFooter,
}: {
  children: React.ReactNode;
  cardFooter: Array<{ text: string; href: string }>;
}) {
  return (
    <>
      <Card className="w-full shadow-2xl rounded-md bg-card">
        <CardHeader className="relative">
          <span className="absolute right-2 top-2">
            <SwitchTheme />
          </span>
          <CardTitle className="font-dancing text-5xl font-bold">
            <Link href="/">Instafeed</Link>
          </CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>

        <div className="flex justify-between text-center gap-3 font-medium my-2">
          <Separator className=" dark:bg-white bg-gray-300 sm:w-[47%] w-[40%] my-2" />
          <p>OR</p>
          <Separator className=" dark:bg-white bg-gray-300 sm:w-[47%] w-[40%] my-2" />
        </div>

        <CardFooter className="flex flex-col justify-center items-center gap-2">
          {cardFooter.map((item, index) => (
            <Link key={index} href={item.href} className="text-blue-800">
              {item.text}
            </Link>
          ))}
        </CardFooter>
      </Card>
    </>
  );
}
