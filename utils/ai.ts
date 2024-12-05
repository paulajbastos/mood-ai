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

import { TJournalEntryProps } from '@/types/prisma';

export const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z
      .string()
      .describe('the mood of the person who wrote the journal entry.'),
    subject: z.string().describe('the subject of the journal entry.'),
    negative: z
      .boolean()
      .describe(
        'is the journal entry negative? (i.e. does it contain negative emotions?).',
      ),
    summary: z.string().describe('quick summary of the entire entry.'),
    color: z
      .string()
      .describe(
        'a hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness.',
      ),
    sentimentScore: z
      .number()
      .describe(
        'sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive.',
      ),
  }),
);

export const getPrompt = async (content: string) => {
  const format_instructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      'Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  });

  const input = await prompt.format({
    entry: content,
  });

  return input;
};

export const analyze = async (entry: string) => {
  const input = await getPrompt(entry);
  const model = new ChatOpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' });
  const output = await model.invoke(input);

  try {
    return parser.parse(output.content.toString());
  } catch {
    // console.log('analyze error', e);
    // const fixParser = OutputFixingParser.fromLLM(
    //   new ChatOpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' }),
    //   parser
    // );
    // const fix = await fixParser.parse(output.content);
    // return fix;
  }
};

export const qa = async (question: string, entries: TJournalEntryProps[]) => {
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
