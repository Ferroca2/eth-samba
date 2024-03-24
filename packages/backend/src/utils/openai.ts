import OpenAI from "openai";

const openai = new OpenAI();


export const getOpenAIResponse = async (prompt: string) => {
  const completion = await openai.chat.completions.create({
    messages: [{"role": "system", "content": "You are a helpful assistant designed to output JSON."},
        {"role": "user", "content": prompt},
      ],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
  });
  return completion.choices[0].message.content;
}