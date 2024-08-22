"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";

interface FormComponentProps<T> {
  schema: z.ZodSchema<T>;
  fields: Array<{
    name: any;
    placeholder: string;
    type?: string;
  }>;
  onSubmit: (data: T) => void;
  buttonText: string;
  isPending?: boolean;
}

export function FormComponent<T>({
  schema,
  fields,
  onSubmit,
  buttonText,
  isPending,
}: FormComponentProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: fields.reduce(
      (acc, field) => ({ ...acc, [field.name]: "" }),
      {} as T
    ),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        {fields.map((data: any, index: any) => (
          <FormField
            key={index}
            control={form.control}
            name={data.name}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  {data.type === "otp" ? (
                    <div className="w-full flex items-center justify-center">
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={0}
                            className="dark:bg-white dark:text-black"
                          />
                          <InputOTPSlot
                            index={1}
                            className="dark:bg-white dark:text-black"
                          />
                          <InputOTPSlot
                            index={2}
                            className="dark:bg-white dark:text-black"
                          />
                          <InputOTPSlot
                            index={3}
                            className="dark:bg-white dark:text-black"
                          />
                          <InputOTPSlot
                            index={4}
                            className="dark:bg-white dark:text-black"
                          />
                          <InputOTPSlot
                            index={5}
                            className="dark:bg-white dark:text-black"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  ) : (
                    <div className="relative">
                      <Input
                        {...field}
                        type={
                          data.type || data.type === "password"
                            ? showPassword
                              ? "text"
                              : "password"
                            : "text"
                        }
                        placeholder={data.placeholder}
                        className="p-5 dark:bg-white dark:text-black"
                      />
                      {data.name === "password" && (
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 flex items-center px-2"
                        >
                          {showPassword ? (
                            <EyeNoneIcon className="dark:text-black " />
                          ) : (
                            <EyeOpenIcon className="dark:text-black " />
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </FormControl>
                <FormMessage className="dark:text-red-500" />
              </FormItem>
            )}
          />
        ))}
        <Button className="w-full" disabled={isPending}>
          {isPending ? "Loading..." : buttonText}
        </Button>
      </form>
    </Form>
  );
}
