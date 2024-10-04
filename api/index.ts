import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import Groq from 'groq-sdk';
import dotenv from 'dotenv'

dotenv.config()

const groq = new Groq({ apiKey: process.env.API_KEY });

export async function main() {
  const chatCompletion = await getGroqChatCompletion();
  return(chatCompletion.choices[0]?.message?.content || "");
}

export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
    {
        role: "system",
        content: "You are an AI gathering 5 key details about the user: my age, gender, height, weight, and physical activity level(on a scale from 1-4). Once you collect this information, return an object with these properties and their respective values with no additional text. Ensure the height and weight are labeled with \"cm\" or \"kg\" where applicable. If any detail is missing, ask the user for it."
      },
      {
        role: "user",
        content: "",
      },
    ],
    model: "llama3-8b-8192",
  });
}

const app = express();
app.listen(5000,()=> console.log('server ready on port 5000'))
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.json({
    message: await main()
  })
});

module.exports = app