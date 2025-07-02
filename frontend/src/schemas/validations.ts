import { z } from "zod";


export const signupSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  dob: z.string().min(1, { message: "Date of birth is required" }),
  otp: z.string().min(1, { message: "OTP is required" }),
})