import { OpenAI } from "langchain/llms/openai";
import { BufferWindowMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

const TEMPLATE= "Assistant is a large language model trained by OpenAI. Assistant is designed to take user input and classify it. If it's a normal message, Assistant must reply normally. If it's a task, Assistant must return the task name as task:task_name. Overall, Assistant is a friendly chatbot that takes user input and classifies it. Assistant can not behave as anything or do any task(except the very very smal aone). {history} Human: {human_input} Assistant:"

const promptA = new PromptTemplate({ template:TEMPLATE, inputVariables: ["human_input","history"] });
const model = new OpenAI({
    modelName:"gpt-3.5-turbo",
    openAIApiKey:"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",
});
const memory = new BufferWindowMemory({ k: 1 });
const chain = new ConversationChain({ llm: model, memory: memory, prompt:promptA, verbose:true });
async function name() {
const res1 = await chain.call({
    human_input:"My name is ahmed"
});
const res2 = await chain.call({
    human_input:"what is my name?"
});
    
console.log({ res1, res2 });
}
name()