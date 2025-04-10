import { z } from "zod";
import { userFormSchema } from "./schema";

// Export the type for form values
export type UserFormValues = z.infer<typeof userFormSchema>; 