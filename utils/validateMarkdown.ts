import { z } from 'zod';

// Define a schema for updates
const markdownSchema = z.object({
  content: z.string().min(1, 'Content cannot be empty'), // Ensure content exists
});

// Validate content before sending to the API
export const validateMarkdownContent = (updates: { content: string }) => {
  return markdownSchema.parse(updates);
};
