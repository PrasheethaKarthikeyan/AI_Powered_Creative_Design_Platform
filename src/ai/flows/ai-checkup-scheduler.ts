'use server';
/**
 * @fileOverview A flow for scheduling eye checkups based on user's health data.
 *
 * - scheduleCheckup - A function that handles the checkup scheduling process.
 * - AICheckupSchedulerInput - The input type for the scheduleCheckup function.
 * - AICheckupSchedulerOutput - The return type for the scheduleCheckup function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VisionStatusSchema = z.enum([
  'normal',
  'refractive-error',
  'dry-eye',
  'eye-strain',
  'other',
]);

const SymptomsSchema = z.object({
  headache: z.boolean(),
  dryness: z.boolean(),
  blurredVision: z.boolean(),
  screenFatigue: z.boolean(),
});

const AICheckupSchedulerInputSchema = z.object({
  lastCheckupDate: z.string().describe('Date of the last eye checkup in YYYY-MM-DD format.'),
  visionStatus: VisionStatusSchema.describe('The user\'s current vision status.'),
  prescriptionChanged: z.boolean().describe('Whether the prescription changed at the last checkup.'),
  symptoms: SymptomsSchema.describe('Symptoms the user is experiencing.'),
  ageGroup: z.string().describe('The age group of the user (e.g., 20-30).'),
  screenTime: z.number().describe('Average daily screen time in hours.'),
});
export type AICheckupSchedulerInput = z.infer<
  typeof AICheckupSchedulerInputSchema
>;

const AICheckupSchedulerOutputSchema = z.object({
  nextCheckupDate: z.string().describe('Recommended date for the next checkup.'),
  frequency: z.string().describe('Recommended checkup frequency (e.g., "Every 12 months").'),
  reason: z.string().describe('A simple explanation for the recommendation.'),
  selfCareReminders: z.array(z.string()).describe('A list of self-care tips.'),
});
export type AICheckupSchedulerOutput = z.infer<
  typeof AICheckupSchedulerOutputSchema
>;

export async function scheduleCheckup(
  input: AICheckupSchedulerInput
): Promise<AICheckupSchedulerOutput> {
  return aICheckupSchedulerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aICheckupSchedulerPrompt',
  input: {schema: AICheckupSchedulerInputSchema},
  output: {schema: AICheckupSchedulerOutputSchema},
  prompt: `You are an AI assistant providing eye checkup recommendations. You are not a medical professional. Your advice must be safe, non-diagnostic, and advisory only.

Based on the following user data, create a personalized and reassuring checkup schedule:
- Last Checkup: {{{lastCheckupDate}}}
- Vision Status: {{{visionStatus}}}
- Prescription Changed: {{{prescriptionChanged}}}
- Symptoms:
  - Headache: {{{symptoms.headache}}}
  - Dryness: {{{symptoms.dryness}}}
  - Blurred Vision: {{{symptoms.blurredVision}}}
  - Screen Fatigue: {{{symptoms.screenFatigue}}}
- Age Group: {{{ageGroup}}}
- Daily Screen Time: {{{screenTime}}} hours

Your recommendation should include:
1.  **nextCheckupDate**: A specific month and year (e.g., "June 2026").
2.  **frequency**: How often to get a checkup (e.g., "Every 6 months," "Every 12 months," "Sooner if symptoms worsen").
3.  **reason**: A simple, clear reason for the recommended frequency, linking it to the user's data (e.g., "Because your prescription changed and you experience screen fatigue...").
4.  **selfCareReminders**: A few gentle, actionable tips for daily eye care (e.g., "Follow the 20-20-20 rule," "Stay hydrated," "Practice daily eye exercises").

Keep the tone friendly and reassuring. Do not use alarming language. Prioritize user safety.

Example Logic:
- If 'refractive-error' and 'prescriptionChanged' is true, recommend 12 months.
- If symptoms are present and screen time is high (>6 hours), recommend 6-12 months.
- If vision is 'normal' with no symptoms, recommend 24 months.
- If age is over 40, recommend more frequent checkups (e.g., every 12 months).

Generate the response.`,
});

const aICheckupSchedulerFlow = ai.defineFlow(
  {
    name: 'aICheckupSchedulerFlow',
    inputSchema: AICheckupSchedulerInputSchema,
    outputSchema: AICheckupSchedulerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
