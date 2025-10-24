import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signUpSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  user_name: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
  field: z.string().min(1, "Please select a field"),
  industry: z.string().min(1, "Please select an industry"),
  years_of_experience: z.string().min(1, "Please select years of experience"),
  state: z.string().min(1, "Please select a state"),
  lga: z.string().min(1, "Please select a local government area"),
  acceptedTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export const recruiterSignInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const recruiterSignUpSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"), 
  user_name: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
  field: z.string().min(1, "Please select a field"),
  industry: z.string().min(1, "Please select an industry"),
  bio: z.string().min(20, "Company bio must be at least 20 characters"),
  acceptedTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});