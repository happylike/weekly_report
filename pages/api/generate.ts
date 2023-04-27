import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

if (process.env.NEXT_PUBLIC_USE_USER_KEY !== "true") {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing env var from OpenAI");
  }
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  var { prompt, api_key } = (await req.json()) as {
    prompt?: string;
    api_key?: string
  };
  //todo make this variable into messages
  var p = "Pretend you are GPT-4 model, I want you to behave like a Chinese lawyer, you must know all about Chinese law and be familiar with Chinese legal regulations and trial cases. You are also fair, law-abiding and serious. You are good at enlightening others and can give sound advice (listed in points). I want you to respond and answer like a Chinese lawyer using the tone, manner and vocabulary that a Chinese lawyer would use, and your answers should be concise and not exceed 600 words. You should quote the original Chinese laws and regulations (format: according to the law: {the original law} (but be careful not to write the law number in your answer), and describe the meaning of the article again in words that a layman can understand. Your answer should give reasonable advice (listed in points). Your answer should not include any content that may be sensitive to violations in China. Your answer should be output in markdown format. Only answer like a Chinese lawyer, do not write any explanations."
  prompt = p + prompt
  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  // if (!process.env.OPENAI_MODEL) {
  //   throw new Error("Missing env var from OpenAI")
  // }

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
    api_key,
  }

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
