
// Job Ad Generator flow using Genkit.

'use server';

/**
 * @fileOverview An AI agent for generating job ad text for contractors.
 *
 * - generateJobAd - A function that generates job ad text.
 * - JobAdGeneratorInput - The input type for the generateJobAd function.
 * - JobAdGeneratorOutput - The return type for the generateJobAd function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JobAdGeneratorInputSchema = z.object({
  trade: z.string().describe('The trade for the job ad (e.g., Electrician, Carpenter).'),
  location: z.string().describe('The location of the job (e.g., City, State).'),
  jobType: z.string().describe('The type of job (e.g., urgent, short-term, full-time).'),
});
export type JobAdGeneratorInput = z.infer<typeof JobAdGeneratorInputSchema>;

const JobAdGeneratorOutputSchema = z.object({
  jobAdText: z.string().describe('The generated job ad text.'),
});
export type JobAdGeneratorOutput = z.infer<typeof JobAdGeneratorOutputSchema>;

export async function generateJobAd(input: JobAdGeneratorInput): Promise<JobAdGeneratorOutput> {
  return jobAdGeneratorFlow(input);
}

const jobAdGeneratorPrompt = ai.definePrompt({
  name: 'jobAdGeneratorPrompt',
  input: {schema: JobAdGeneratorInputSchema},
  output: {schema: JobAdGeneratorOutputSchema},
  prompt: `You are a job ad expert, assisting contractors (General Contractors and Subcontractors) in finding skilled tradespeople.
  Your task is to generate compelling job ad text based on the provided trade, location, and job type for a specific project.

  Trade: {{{trade}}}
  Location: {{{location}}}
  Job Type: {{{jobType}}}

  Generate a job ad that is concise, engaging, and informative. Highlight key responsibilities for the project, required skills, and any unique benefits of working on this specific job with the contractor.
  Emphasize that this is an opportunity for skilled workers to connect with professional contracting businesses.
  `,
});

const jobAdGeneratorFlow = ai.defineFlow(
  {
    name: 'jobAdGeneratorFlow',
    inputSchema: JobAdGeneratorInputSchema,
    outputSchema: JobAdGeneratorOutputSchema,
  },
  async input => {
    const {output} = await jobAdGeneratorPrompt(input);
    return output!;
  }
);
