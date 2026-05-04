import { GoogleGenAI } from '@google/genai';
import wav from 'wav';

async function saveWaveFile(
  filename,
  pcmData,
  channels = 1,
  rate = 24000,
  sampleWidth = 2,
) {
  return new Promise((resolve, reject) => {
    const writer = new wav.FileWriter(filename, {
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    writer.on('finish', resolve);
    writer.on('error', reject);

    writer.write(pcmData);
    writer.end();
  });
}

async function main() {
  const ai = new GoogleGenAI({ apiKey: 'AIzaSyD9Yl1Uu4rdy1jYIIzQaBZubjl8sbhZY1Y' });

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-tts-preview",
    contents: [{ parts: [{ text: 'Ask in hindi language: Tum kaise ho batao?' }] }],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  const audioBuffer = Buffer.from(data, 'base64');

  const fileName = 'out.wav';
  await saveWaveFile(fileName, audioBuffer);
}
await main();
