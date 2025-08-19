import * as dotenv from "dotenv";
dotenv.config();

const config = {
  DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY || "23d67a9abe0c12297afa9aea491d6d1381ec00d6",
};

export default config;
