import * as z from "zod";

export const UserSchema = z.object({
  firstName: z.string({ required_error: "first name is required" }),
  lastName: z.string({ required_error: "last name is required" }),
  username: z
    .string({ required_error: "username is required" })
    .min(4, { message: "username must be at least 4 characters long" })
    .max(30, { message: "username must be at most 30 characters long" })
    .regex(/^[a-zA-Z0-9]+$/),
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "invalid email" }),
  password: z
    .string({ required_error: "password is required" })
    .min(8, { message: "password must be at least 8 characters long" }),
  phone: z.string().optional(),
  bio: z.string().optional(),
  gender: z.enum(["male", "female", "other"], {
    message: "invalid gender",
  }),
});

export const SignInSchema = z.object({
  username: z
    .string({ required_error: "username is required" })
    .min(4, { message: "username must be at least 4 characters long" })
    .max(30, { message: "username must be at most 30 characters long" })
    .regex(/^[a-zA-Z0-9]+$/),
  password: z
    .string({ required_error: "password is required" })
    .min(8, { message: "password must be at least 8 characters long" }),
});

export const EmailSchema = z.object({
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "invalid email" }),
});

export const OtpSchema = z.object({
  otp: z
    .string({ required_error: "otp is required" })
    .min(6, { message: "otp must be at least 6 characters long" }),
});

export const ResetPasswordSchema = z.object({
  otp: z
    .string({ required_error: "otp is required" })
    .min(6, { message: "otp must be at least 6 characters long" }),
  password: z
    .string({ required_error: "password is required" })
    .min(8, { message: "password must be at least 8 characters long" }),
});

export const ChangePasswordSchema = z.object({
  password: z
    .string({ required_error: "password is required" })
    .min(8, { message: "password must be at least 8 characters long" }),
});
