import { Ollama } from "ollama";

export function createAiClient() {
  return new Ollama({
    host: "https://ai.yfbd.org",
  });
}

export async function getImageContext(files: File[]) {
  const ai = createAiClient();

  // Convert file to base64
  const base64s = await Promise.all(
    files.map(async (file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          // Remove data URL prefix
          resolve(base64.split(",")[1]);
        };
        reader.readAsDataURL(file);
      });
    }),
  );

  // Call Llava model to analyze the image
  const response = await ai.generate({
    model: "llava:7b",
    prompt: "Describe this image in detail",
    images: base64s,
    stream: true,
  });

  for await (const chunk of response) {
    console.log(chunk);
  }

  return response;
}
