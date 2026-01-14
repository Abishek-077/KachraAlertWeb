import { z } from "zod";

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[0-9]/, "Password must include a number")
    .regex(/[^A-Za-z0-9]/, "Password must include a special character");

export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
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
    password: passwordSchema
});

export type RegisterStep1Data = z.infer<typeof registerStep1Schema>;

export const registerStep2Schema = z.object({
    society: z.string().min(2, "Society is required"),
    building: z.string().min(1, "Building is required"),
    apartment: z.string().min(1, "Apartment is required"),
    terms: z.boolean().refine((v) => v === true, "You must accept terms")
});

export type RegisterStep2Data = z.infer<typeof registerStep2Schema>;

export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email format")
});

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Reset token is required"),
    password: passwordSchema,
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
