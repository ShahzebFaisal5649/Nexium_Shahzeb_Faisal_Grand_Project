// src/ai/utils/tailoringOptions.ts
export type TailoringOptions = {
  intensity: "light" | "moderate" | "aggressive";
  lockedSections: string[];
  customInstructions?: string;
};

export function createTailoringOptions(data: {
  intensity: "light" | "moderate" | "aggressive";
  lockedSections: string[];
  customInstructions?: string;
}): TailoringOptions {
  return {
    intensity: data.intensity,
    lockedSections: data.lockedSections,
    ...(data.customInstructions ? { customInstructions: data.customInstructions } : {}),
  };
}