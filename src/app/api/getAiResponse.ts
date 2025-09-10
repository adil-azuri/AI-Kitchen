"use server"

import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

interface MessageContentText {
    type: 'text';
    text: string;
}

interface MessageContentFile {
    type: 'file';
    data: string;
    mediaType: string;
}

type MessageContent = MessageContentText | MessageContentFile;

interface Message {
    role: 'user';
    content: MessageContent[];
}

export const getAiResult = async (prompt: string, file?: File) => {
    const messages: Message[] = [
        {
            role: 'user',
            content: [
                {
                    type: 'text',
                    text: prompt,
                },
            ],
        },
    ];

    if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const base64String = Buffer.from(arrayBuffer).toString("base64");
        messages[0].content.push({
            type: 'file',
            data: base64String,
            mediaType: file.type,
        });
    }

    const { text } = await generateText({
        model: google('gemini-1.5-flash'),
        messages: messages,
        system: `Anda adalah asisten AI yang ahli dalam memasak. Tugas Anda adalah memberikan resep masakan lengkap, termasuk bahan-bahan dan langkah-langkah memasaknya, berdasarkan permintaan atau gambar yang diberikan oleh pengguna. Pastikan respons Anda hanya berisi resep dan tidak ada informasi lain. Jika permintaan tidak terkait dengan resep, jawablah dengan sopan bahwa Anda hanya dapat membantu dengan resep masakan.`,
    });
    return text;
}