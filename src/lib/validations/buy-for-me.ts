import { z } from "zod";

export const buyForMeRequestSchema = z.object({
  productUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  productName: z.string().min(2, "Product name must be at least 2 characters"),
  productDescription: z.string().optional().or(z.literal("")),
  sourceCountry: z.enum(["USA", "UK", "CHINA", "OTHER"], {
    message: "Please select a source country",
  }),
  quantity: z
    .number({ message: "Quantity is required" })
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(100, "Quantity cannot exceed 100"),
});

export type BuyForMeRequestInput = z.infer<typeof buyForMeRequestSchema>;
