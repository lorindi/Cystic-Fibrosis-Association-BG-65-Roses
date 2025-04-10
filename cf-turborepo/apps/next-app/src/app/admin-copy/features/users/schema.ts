import * as z from "zod";

// Schema for form validation
export const userFormSchema = z.object({
  name: z.string().min(2, { message: "Name should be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  birthDate: z.string().optional(),
  diagnosisYear: z.string().optional(),
  childName: z.string().optional(),
  companyName: z.string().optional(),
  phone: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  bio: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>; 