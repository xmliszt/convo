"use server";

import { openai } from "@/lib/ai/openai";

export async function readText(text: string, gender?: string) {
    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: gender === "male" ? "echo" : "alloy",
        input: text,
    });

    const mp3Data = await mp3.arrayBuffer();
    const base64Mp3 = Buffer.from(mp3Data).toString("base64");

    return base64Mp3;
}3