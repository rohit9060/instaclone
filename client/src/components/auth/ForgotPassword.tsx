"use client";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Api } from "@/lib";

export function ForgotPassword() {
  const { toast } = useToast();

  const fields: Array<{
    name: keyof (typeof Schema)["shape"];
    placeholder: string;
  }> = [
    {
      name: "email",
      placeholder: "email",
    },
  ];

  const Schema = z.object({
    email: z.string().email(),
  });

  const form = useForm({
    resolver: zodResolver(Schema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof Schema>) => {
      const response = await Api.post("/users/password/forgot", data);
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onsubmit)}
          className="space-y-8 w-full"
        >
          {fields.map((data, index) => (
            <FormField
              key={index}
              control={form.control}
              name={data.name}
              render={({ field }) => (
                <FormItem key={index}>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={data.placeholder}
                      className="p-5 dark:bg-white dark:text-black"
                    />
                  </FormControl>
                  <FormMessage className="dark:text-red-500" />
                </FormItem>
              )}
            />
          ))}
          <Button className="w-full" disabled={isPending}>
            {isPending ? "Loading..." : "Forgot Password"}
          </Button>
        </form>
      </Form>
    </>
  );
}
