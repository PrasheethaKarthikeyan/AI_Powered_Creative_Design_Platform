'use server';

/**
 * @fileOverview AI symptom analysis flow for providing personalized eye health advice.
 *
 * - analyzeSymptoms - Analyzes user-logged symptoms and provides personalized advice.
 * - AISymptomAnalysisInput - The input type for the analyzeSymptoms function.
 * - AISymptomAnalysisOutput - The return type for the analyzeSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISymptomAnalysisInputSchema = z.object({
  eyeDryness: z
    .number()
    .min(0)
    .max(10)
    .describe('Rating of eye dryness (0-10).'),
  itching: z.number().min(0).max(10).describe('Rating of itching (0-10).'),
  roughness: z.number().min(0).max(10).describe('Rating of roughness (0-10).'),
  headache: z.number().min(0).max(10).describe('Rating of headache (0-10).'),
  eyeStrain: z.number().min(0).max(10).describe('Rating of eye strain (0-10).'),
  redness: z.number().min(0).max(10).describe('Rating of eye redness (0-10).'),
  glassesUser: z.boolean().describe('Whether the user wears glasses or not.'),
});
export type AISymptomAnalysisInput = z.infer<typeof AISymptomAnalysisInputSchema>;

const AISymptomAnalysisOutputSchema = z.object({
  advice: z.string().describe('Personalized advice based on symptoms.'),
});
export type AISymptomAnalysisOutput = z.infer<typeof AISymptomAnalysisOutputSchema>;

export async function analyzeSymptoms(
  input: AISymptomAnalysisInput
): Promise<AISymptomAnalysisOutput> {
  return aiSymptomAnalysisFlow(input);
}

const aiSymptomAnalysisPrompt = ai.definePrompt({
  name: 'aiSymptomAnalysisPrompt',
  input: {schema: AISymptomAnalysisInputSchema},
  output: {schema: AISymptomAnalysisOutputSchema},
  prompt: `You are an AI eye health assistant. Based on the user\'s reported symptoms, provide personalized advice. Consider these factors:

*   **Eye Dryness (0-10):** Severity of dryness.
*   **Itching (0-10):** Severity of itching.
*   **Roughness (0-10):** Severity of roughness.
*   **Headache (0-10):** Severity of headache.
*   **Eye Strain (0-10):** Severity of eye strain.
*   **Redness (0-10):** Severity of eye redness.
*   **Glasses User:** Whether the user wears glasses.

Give personalized advice including screen time reduction, blinking reminders, eye rest techniques, and when to consult an eye doctor. Focus on actionable steps the user can take.

Symptoms: Eye Dryness: {{{eyeDryness}}}, Itching: {{{itching}}}, Roughness: {{{roughness}}}, Headache: {{{headache}}}, Eye Strain: {{{eyeStrain}}}, Redness: {{{redness}}}. Glasses User: {{{glassesUser}}}.

Do not provide any disclaimers or caveats.
Response: `,
});

const aiSymptomAnalysisFlow = ai.defineFlow(
  {
    name: 'aiSymptomAnalysisFlow',
    inputSchema: AISymptomAnalysisInputSchema,
    outputSchema: AISymptomAnalysisOutputSchema,
  },
  async input => {
    // Rule-based logic can be implemented here before calling the prompt, if needed.

    const {output} = await aiSymptomAnalysisPrompt(input);
    return output!;
  }
);
