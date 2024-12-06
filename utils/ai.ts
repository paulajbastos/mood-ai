import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { Document } from 'langchain/document';
import { loadQARefineChain } from 'langchain/chains';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import {
  StructuredOutputParser,
  // OutputFixingParser,
} from 'langchain/output_parsers';
import z from 'zod';

import { TEntryProps } from '@/types/prisma';
import { unescapeMarkdown } from './api';
// import { escapeMarkdown, unescapeMarkdown } from './api';

export const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    type: z
      .string()
      .describe(
        'the type of the code snippet inside markdown element, if available; If you dont find any markdown, other than that, try figuring out the type somehow. Do your best!',
      ),
    projectName: z
      .string()
      .describe(
        'Look for Project Name to create this value. If does not exist, apply n/a',
      ),
    subject: z.string().describe('the subject of the activity entry.'),
    summary: z.string().describe('quick summary of the entire activity entry.'),
    color: z
      .string()
      .describe(
        'a hexidecimal color code that represents the type of activity based on github repository language color of the repository. Example #3178c6 representing Typescript and #663399 for CSS. Add all the colors you can find in the github repository language colors classes.',
      ),
  }),
);

export const getPrompt = async (content: string) => {
  const format_instructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      'Analyze the following activity entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  });

  const input = await prompt.format({
    entry: unescapeMarkdown(content),
  });

  return input;
};

export const analyze = async (entry: string) => {
  const input = await getPrompt(entry);
  const model = new ChatOpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' });
  const output = await model.invoke(input);
  try {
    return parser.parse(output.content.toString());
  } catch (e) {
    console.log('analyze error', e);
    // const fixParser = OutputFixingParser.fromLLM(
    //   new ChatOpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' }),
    //   parser
    // );
    // const fix = await fixParser.parse(output.content);
    // return fix;
  }
};

export const qa = async (question: string, entries: TEntryProps[]) => {
  const docs = entries.map(
    (entry) =>
      new Document({
        pageContent: entry.content,
        metadata: { source: entry.id, date: entry.createdAt },
      }),
  );
  const model = new ChatOpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' });
  // combine documents by doing a first pass and then refining on more documents
  const chain = loadQARefineChain(model);
  // call to openai embeddings to send the text and it will return some vectors
  const embeddings = new OpenAIEmbeddings();
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
  const relevantDocs = await store.similaritySearch(question);
  const res = await chain.invoke({
    input_documents: relevantDocs,
    question,
  });

  return res.output_text;
};
