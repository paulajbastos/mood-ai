import { TEntryProps } from '@/types/prisma';

import { validateMarkdownContent } from './validateMarkdown';

const createURL = (path: string) => window.location.origin + path;

export const newEntry = async () => {
  const res = await fetch(
    new Request(createURL('/api/entry'), {
      method: 'POST',
    }),
  );

  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Something went wrong on API server!');
  }
};

export const updateEntry = async (id: string, updates: TEntryProps) => {
  // console.log('updates', updates.content);

  try {
    // Validate and sanitize markdown content
    if (!updates.content || !validateMarkdownContent(updates)) {
      throw new Error('Invalid or missing content.');
    }

    const escapedContent = escapeMarkdown(updates.content);
    // console.log('Escaped content:', escapedContent);

    // Ensure escaped content is valid
    if (!escapedContent) {
      throw new Error('Escaped content is invalid.');
    }

    // Create a copy of updates with the sanitized content
    const updatedData = { ...updates, content: escapedContent };

    console.log('updates', updates);
    console.log('updatedData', updatedData);

    // Make the API request
    const response = await fetch(
      new Request(createURL(`/api/entry/${id}`), {
        method: 'PATCH',
        body: JSON.stringify({ updates: updatedData }),
      }),
    );
    if (!response.ok) {
      const errorMsg =
        response.status === 500
          ? `Server error: ${response.statusText}`
          : 'Failed to update entry on API server.';
      throw new Error(errorMsg);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to update entry:', error);
    throw error;
  }
};

export const deleteEntry = async (id: string) => {
  const res = await fetch(
    new Request(createURL(`/api/entry/${id}`), {
      method: 'DELETE',
    }),
  );

  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Something went wrong on API server!');
  }
};

export const askQuestion = async (question: string) => {
  const res = await fetch(
    new Request(createURL(`/api/question`), {
      method: 'POST',
      body: JSON.stringify({ question }),
    }),
  );

  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Something went wrong on API server!');
  }
};

export const escapeMarkdown = (markdown: string): string => {
  return markdown
    .replace(/\\/g, '\\\\') // Escape backslashes
    .replace(/`/g, '\\`') // Escape backticks
    .replace(/\*/g, '\\*') // Escape asterisks
    .replace(/_/g, '\\_') // Escape underscores
    .replace(/{/g, '\\{') // Escape curly braces
    .replace(/}/g, '\\}') // Escape curly braces
    .replace(/\[/g, '\\[') // Escape brackets
    .replace(/]/g, '\\]') // Escape brackets
    .replace(/\(/g, '\\(') // Escape parentheses
    .replace(/\)/g, '\\)') // Escape parentheses
    .replace(/#/g, '\\#') // Escape hashtags
    .replace(/\+/g, '\\+') // Escape plus signs
    .replace(/-/g, '\\-') // Escape minus signs
    .replace(/\./g, '\\.') // Escape dots
    .replace(/!/g, '\\!'); // Escape exclamation marks
};

export const unescapeMarkdown = (markdown: string): string => {
  return markdown
    .replace(/\\`/g, '`') // Unescape backticks
    .replace(/\\\*/g, '*') // Unescape asterisks
    .replace(/\\_/g, '_') // Unescape underscores
    .replace(/\\{/g, '{') // Unescape curly braces
    .replace(/\\}/g, '}') // Unescape curly braces
    .replace(/\\\[/g, '[') // Unescape brackets
    .replace(/\\\]/g, ']') // Unescape brackets
    .replace(/\\\(/g, '(') // Unescape parentheses
    .replace(/\\\)/g, ')') // Unescape parentheses
    .replace(/\\#/g, '#') // Unescape hashtags
    .replace(/\\\+/g, '+') // Unescape plus signs
    .replace(/\\-/g, '-') // Unescape minus signs
    .replace(/\\\./g, '.') // Unescape dots
    .replace(/\\!/g, '!') // Unescape exclamation marks
    .replace(/\\\\/g, '\\'); // Unescape backslashes
};
