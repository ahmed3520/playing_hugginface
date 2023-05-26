// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { z } from "zod";

const HF_ACCESS_TOKEN = process.env.HF_ACCESS_TOKEN;
const OLD_MODELS = process.env.OLD_MODELS;
const MODELS = process.env.MODELS;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const MODEL= {
    "name": "OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
    "datasetName": "OpenAssistant/oasst1",
    "description": "A good alternative to ChatGPT",
    "websiteUrl": "https://open-assistant.io",
    "userMessageToken": "<|prompter|>",
    "assistantMessageToken": "<|assistant|>",
    "messageEndToken": "</s>",
    "preprompt": "Below are a series of dialogues between various people and an AI assistant. The AI tries to be helpful, polite, honest, sophisticated, emotionally aware, and humble-but-knowledgeable. The assistant is happy to help with almost anything, and will do its best to understand exactly what is needed. It also tries to avoid giving false or misleading information, and it caveats when it isn't entirely sure about the right answer. That said, the assistant is practical and really does its best, and doesn't let caution get too much in the way of being useful.\n-----\n",
    "promptExamples": [
      {
        "title": "Write an email from bullet list",
        "prompt": "As a restaurant owner, write a professional email to the supplier to get these products every week: \n\n- Wine (x10)\n- Eggs (x24)\n- Bread (x12)"
      }, {
        "title": "Code a snake game",
        "prompt": "Code a basic snake game in python, give explanations for each step."
      }, {
        "title": "Assist in a task",
        "prompt": "How do I make a delicious lemon cheesecake?"
      }
    ],
    "parameters": {
      "temperature": 0.9,
      "top_p": 0.95,
      "repetition_penalty": 1.2,
      "top_k": 50,
      "truncate": 1000,
      "max_new_tokens": 1024
    }
  }
const modelsRaw = z
  .array(
    z.object({
      /** Used as an identifier in DB */
      id: z.string().optional(),
      /** Used to link to the model page, and for inference */
      name: z.string().min(1),
      displayName: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      websiteUrl: z.string().url().optional(),
      datasetName: z.string().min(1).optional(),
      userMessageToken: z.string().min(1),
      assistantMessageToken: z.string().min(1),
      messageEndToken: z.string().min(1).optional(),
      preprompt: z.string().default(""),
      prepromptUrl: z.string().url().optional(),
      promptExamples: z
        .array(
          z.object({
            title: z.string().min(1),
            prompt: z.string().min(1),
          })
        )
        .optional(),
      endpoints: z
        .array(
          z.object({
            url: z.string().url(),
            authorization: z
              .string()
              .min(1)
              .default(`Bearer ${HF_ACCESS_TOKEN}`),
            weight: z.number().int().positive().default(1),
          })
        )
        .optional(),
      parameters: z
        .object({
          temperature: z.number().min(0).max(1),
          truncate: z.number().int().positive(),
          max_new_tokens: z.number().int().positive(),
          stop: z.array(z.string()).optional(),
        })
        .passthrough()
        .optional(),
    })
  )
  .parse(MODELS);

  export const models = Promise.all(
    modelsRaw.map((m) =>
      m.prepromptUrl
        ? fetch(m.prepromptUrl)
            .then((r) => r.text())
            .then((preprompt) => ({
              ...m,
              id: m.id || m.name,
              displayName: m.displayName || m.name,
              preprompt,
            }))
        : Promise.resolve({
            ...m,
            id: m.id || m.name,
            displayName: m.displayName || m.name,
            preprompt: m.preprompt,
          })
    )
  );
  

console.log("models=>, models")
// Models that have been deprecated
/*export const oldModels = OLD_MODELS
  ? z
      .array(
        z.object({
          id: z.string().optional(),
          name: z.string().min(1),
          displayName: z.string().min(1).optional(),
        })
      )
      .parse(JSON.parse(OLD_MODELS))
      .map((m) => ({
        ...m,
        id: m.id || m.name,
        displayName: m.displayName || m.name,
      }))
  : [];

*/