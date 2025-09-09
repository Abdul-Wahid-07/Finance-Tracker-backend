import { z } from "zod";

const signupSchema = z.object({
    username: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(3, { message: "Name must be atleast of 3 characters"})
    .max(255, { message: "Name must not be more than 255 characters"}),

    email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be atleast of 3 characters"})
    .max(255, { message: "Email must not be more than 255 characters"}),

    income: z
    .number({ required_error: "Income is required" })
    .min(0, { message: "Income cannot be negative"}),

    password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be atleast of 6 characters"})
    .max(1024, { message: "Password must not be more than 1024 characters"}),
});

const loginSchema = signupSchema.pick({
  email: true,
  password: true,
});

const contactSchema = z.object({
  username: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(3, { message: "Name must be atleast of 3 characters"})
    .max(255, { message: "Name must not be more than 255 characters"}),

  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be atleast of 3 characters"})
    .max(255, { message: "Email must not be more than 255 characters"}),
    
  message: z
  .string({ required_error: "Message is required" })
  .trim()
  .min(3, { message: "Message must be atleast of 3 characters"})
  .max(255, { message: "Message must not be more than 255 characters"}),
})

export default { signupSchema, loginSchema, contactSchema };
