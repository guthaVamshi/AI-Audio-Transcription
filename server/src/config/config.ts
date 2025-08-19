import * as dotenv from "dotenv";
dotenv.config();

const config = {
  DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY,
};

export default config;
