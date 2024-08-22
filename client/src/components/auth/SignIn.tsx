"use client";
import * as z from "zod";
import { Api } from "@/lib";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { FormComponent } from "../shared";

export function SignIn() {
  const { toast } = useToast();

  const fields: Array<{
    name: keyof (typeof Schema)["shape"];
    placeholder: string;
    type?: string;
  }> = [
    {
      name: "username",
      placeholder: "username",
    },
    {
      name: "password",
      placeholder: "password",
      type: "password",
    },
  ];

  const Schema = z.object({
    username: z
      .string()
      .min(3, { message: "username must be at least 3 characters" }),
    password: z
      .string()
      .min(8, { message: "password must be at least 8 characters" }),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof Schema>) => {
      const response = await Api.post("/users/signin", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message,
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response.data.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const onsubmit = (data: z.infer<typeof Schema>) => {
    mutate(data);
  };

  return (
    <>
      <FormComponent
        schema={Schema}
        fields={fields}
        onSubmit={onsubmit}
        isPending={isPending}
        buttonText="Sign In"
      />
    </>
  );
}
