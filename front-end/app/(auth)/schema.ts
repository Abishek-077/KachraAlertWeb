import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    remember: z.boolean().optional()
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerStep1Schema = z.object({
    accountType: z.enum(["resident", "admin_driver"], {
        message: "Please choose account type"
    }),
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(7, "Phone is required"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

export type RegisterStep1Data = z.infer<typeof registerStep1Schema>;

export const registerStep2Schema = z.object({
    society: z.string().min(2, "Society is required"),
    building: z.string().min(1, "Building is required"),
    apartment: z.string().min(1, "Apartment is required"),
    terms: z.boolean().refine((v) => v === true, "You must accept terms")
});

export type RegisterStep2Data = z.infer<typeof registerStep2Schema>;
