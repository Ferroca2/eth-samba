import OpenAI from "openai";
import dotenv from "dotenv";
import { filterPrompt } from "./prompt";
dotenv.config();

const openai = new OpenAI();


export const getOpenAIResponse = async (prompt: string) => {
  const completion = await openai.chat.completions.create({
    messages: [{"role": "system", "content": "You are really good to create a counter propose given a initial one and a list of comments about it. You are really good selecting the most relevant comments, the most frequency commented topics and compile those ideas in a new and robust proposal. All maintaining the initial proposal as a base, maintaining details and only changing what is needed."},
        {"role": "user", "content": prompt},
      ],
    model: process.env.CHAT_MODEL_ID!,
    response_format: { type: "json_object" },
  });
  return completion.choices[0].message.content;
}

export const getOpenAIFilter = async (prompt: string) => {
  const completion = await openai.chat.completions.create({
    messages: [{"role": "system", "content": "You are an assistant that out comments that are not related with the situation in a json."},
        {"role": "user", "content": prompt},
      ],
    model: "gpt-4-turbo-preview",
    response_format: { type: "json_object" },
  });
  return completion.choices[0].message.content;
}