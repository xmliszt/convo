"use server";

import fs from "fs";

import { openai,OPENAI_GPT_MODEL_NAME } from "@/lib/ai/openai";

/**
 * Transcribe speech into text from an audioFile
 */
export async function speechToText(audioFile: string) {
  try {
    const audioBuffer = Buffer.from(audioFile, "base64");
    const filePath = __dirname + "/tmp/input.wav";
    fs.writeFileSync(filePath, audioBuffer);
    const readStream = fs.createReadStream(filePath);

    const { text } = await openai.audio.transcriptions.create({
      file: readStream ,
      model: "whisper-1",
    });

    fs.unlinkSync(filePath);

    const completion = await openai.chat.completions.create({
      model: OPENAI_GPT_MODEL_NAME,
      temperature: 0,
      messages: [
        {
          role: "system",
          content: "This speech is made by a user trying to learn english" // TO-DO update prompts for each scenario
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    return completion.choices[0].message.content ?? text
  } catch (error) {
    console.error("Error generating corrected transcript:", error);
    throw error;
  }
}