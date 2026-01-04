import type { AISymptomAnalysisInput } from "@/ai/flows/ai-symptom-analysis";

export type SymptomLog = {
  id: string;
  date: Date;
  symptoms: AISymptomAnalysisInput;
  advice: string;
};
