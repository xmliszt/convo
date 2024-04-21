import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

import { openai } from "@/lib/ai/openai";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const base64Audio: string = body.audio;
    const audio: Buffer = Buffer.from(base64Audio, "base64");
    const filePath: string = "tmp/input.wav";

    try {
        fs.writeFileSync(filePath, audio);
        const readStream = fs.createReadStream(filePath);
        const data = await openai.audio.transcriptions.create({
            file: readStream,
            model: "whisper-1",
        });
        fs.unlinkSync(filePath);

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error processing audio:", error);
        return NextResponse.error();
    }
}