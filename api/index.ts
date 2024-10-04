import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import Groq from 'groq-sdk';
import dotenv from 'dotenv'
import { ChatCompletionCreateParamsNonStreaming } from 'groq-sdk/resources/chat/completions';

dotenv.config()

const groq = new Groq({ apiKey: process.env.API_KEY });

export async function getGroqChatCompletion(messages:ChatCompletionCreateParamsNonStreaming) {
  if(!messages) return {message:""}
  const chatCompletion= await groq.chat.completions.create(messages)
  return(chatCompletion.choices[0]?.message?.content || "");
}

const app = express();
app.listen(5000,()=> console.log('server ready on port 5000'))
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
  const messages = req.body;  
  try {
    const response = await getGroqChatCompletion(messages);
    res.json({ message: response });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = app