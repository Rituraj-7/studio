'use server';

/**
 * @fileOverview Classifies expenses based on their description and title.
 *
 * - classifyExpense - A function that classifies an expense.
 * - ClassifyExpenseInput - The input type for the classifyExpense function.
 * - ClassifyExpenseOutput - The return type for the classifyExpense function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyExpenseInputSchema = z.object({
  title: z.string().describe('The title of the expense.'),
  description: z.string().describe('The description of the expense.'),
});
export type ClassifyExpenseInput = z.infer<typeof ClassifyExpenseInputSchema>;

const ClassifyExpenseOutputSchema = z.object({
  category: z.string().describe('The predicted category of the expense.'),
  confidence: z.number().describe('The confidence level of the prediction (0-1).'),
});
export type ClassifyExpenseOutput = z.infer<typeof ClassifyExpenseOutputSchema>;

export async function classifyExpense(input: ClassifyExpenseInput): Promise<ClassifyExpenseOutput> {
  return classifyExpenseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyExpensePrompt',
  input: {schema: ClassifyExpenseInputSchema},
  output: {schema: ClassifyExpenseOutputSchema},
  prompt: `You are an expert expense classifier.

  Given the title and description of an expense, you will predict the most appropriate category for it.
  You will also provide a confidence level for your prediction, between 0 and 1.

  Title: {{{title}}}
  Description: {{{description}}}
  `,
});

const classifyExpenseFlow = ai.defineFlow(
  {
    name: 'classifyExpenseFlow',
    inputSchema: ClassifyExpenseInputSchema,
    outputSchema: ClassifyExpenseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
