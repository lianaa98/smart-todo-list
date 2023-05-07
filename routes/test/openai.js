import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    organization: "org-SycRMZ9IeWf7HpVSY4jn2Co4",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();

