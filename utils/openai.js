import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    username: "tattoo-jenny",
    apiKey: process.env.OPENAI,
});
export const openai = new OpenAIApi(configuration);
