import { z } from "zod";


export const signupSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  dob: z
    .date({
      required_error: "Date of birth is required",
      invalid_type_error: "Please enter a valid date"
    })
    .min(new Date("1900-01-01"), {
      message: "Date of birth must be after January 1, 1900"
    })
    .max(new Date(), {
      message: "Date of birth cannot be in the future"
    })
    .refine((date) => {
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      const dayDiff = today.getDate() - date.getDate();

      // Calculate exact age
      const exactAge = age - (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? 1 : 0);

      return exactAge >= 13;
    }, {
      message: "You must be at least 13 years old to register"
    })
})

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})