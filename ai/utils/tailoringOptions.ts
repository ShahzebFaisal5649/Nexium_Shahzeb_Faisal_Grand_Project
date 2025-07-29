import { z } from "zod";
import { tailoringRequestSchema } from "@/lib/validations";

// Infer the type from the schema
type TailoringRequest = z.infer<typeof tailoringRequestSchema>;

export type TailoringOptions = {
  intensity: "light" | "moderate" | "aggressive";
  lockedSections: string[];
  customInstructions?: string;
};

/**
 * Transforms validated request data into the options format expected by the tailoring engine
 * @param data Validated request data from the tailoringRequestSchema
 * @returns Properly formatted TailoringOptions object
 */
export function createTailoringOptions(data: TailoringRequest): TailoringOptions {
  return {
    intensity: data.intensity,
    lockedSections: data.lockedSections,
    ...(data.customInstructions ? { customInstructions: data.customInstructions } : {}),
  };
}