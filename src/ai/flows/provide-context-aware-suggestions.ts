'use server';

/**
 * @fileOverview Provides context-aware coding suggestions based on official documentation and GitHub repositories.
 *
 * - provideContextAwareSuggestions - A function that provides coding suggestions.
 * - ProvideContextAwareSuggestionsInput - The input type for the provideContextAwareSuggestions function.
 * - ProvideContextAwareSuggestionsOutput - The return type for the provideContextAwareSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideContextAwareSuggestionsInputSchema = z.object({
  codeSnippet: z
    .string()
    .describe('The code snippet for which to provide suggestions.'),
  programmingLanguage: z
    .string()
    .describe('The programming language of the code snippet.'),
  query: z.string().describe('The specific coding problem or question.'),
});
export type ProvideContextAwareSuggestionsInput = z.infer<
  typeof ProvideContextAwareSuggestionsInputSchema
>;

const ProvideContextAwareSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of context-aware coding suggestions in concise language.'),
  documentationLinks: z
    .array(z.string())
    .describe('Links to official documentation relevant to the suggestions.'),
  githubLinks: z
    .array(z.string())
    .describe('Links to relevant GitHub repositories or code examples.'),
});
export type ProvideContextAwareSuggestionsOutput = z.infer<
  typeof ProvideContextAwareSuggestionsOutputSchema
>;

export async function provideContextAwareSuggestions(
  input: ProvideContextAwareSuggestionsInput
): Promise<ProvideContextAwareSuggestionsOutput> {
  return provideContextAwareSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideContextAwareSuggestionsPrompt',
  input: {schema: ProvideContextAwareSuggestionsInputSchema},
  output: {schema: ProvideContextAwareSuggestionsOutputSchema},
  prompt: `You are an AI expert in providing context-aware coding suggestions.

  Based on the provided code snippet, programming language, and coding problem/question, provide relevant and accurate coding suggestions. The suggestions should be concise.

  Also, include links to official documentation and GitHub repositories that can help the user understand the suggestions and implement them correctly.

  Code Snippet: {{{codeSnippet}}}
  Programming Language: {{{programmingLanguage}}}
  Problem/Question: {{{query}}}

  Suggestions:
  `, // The LLM will generate suggestions
});

const provideContextAwareSuggestionsFlow = ai.defineFlow(
  {
    name: 'provideContextAwareSuggestionsFlow',
    inputSchema: ProvideContextAwareSuggestionsInputSchema,
    outputSchema: ProvideContextAwareSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
