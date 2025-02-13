
export function createAiClient() {
  return {
    generate: async ({
      model,
      prompt,
      images,
      stream,
    }: {
      model: string;
      prompt: string;
      images: string[];
      stream: boolean;
    }) => {
      const response = await fetch("https://ai.yfbd.org/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          prompt,
          images,
          stream,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // For testing purposes
      console.log('API Request:', { model, prompt, stream });

      if (stream) {
        return response.body;
      }

      const jsonResponse = await response.json();
      console.log('API Response:', jsonResponse);
      return jsonResponse;
    },
  };
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

  const response = await ai.generate({
    model: "llava:7b",
    prompt: "Analyze this scene and provide: 1) A detailed description of what is happening in the scene 2) Which emergency service(s) should respond with one (Police, Fire Service, or Ambulance) 3) A severity rating from 1-10, just a number",
    images: base64s,
    stream: true,
  });

  // if (response) {
  //   const reader = response.getReader();
  //   const decoder = new TextDecoder();

  //   try {
  //     while (true) {
  //       const { done, value } = await reader.read();
  //       if (done) break;
        
  //       const chunk = decoder.decode(value);
  //       console.log('Streaming chunk:', chunk);
  //     }
  //   } catch (error) {
  //     console.error('Streaming error:', error);
  //     throw error;
  //   } finally {
  //     reader.releaseLock();
  //   }
  // }

  return response;
}


export async function getReportComment(json: string) {
  const ai = createAiClient();

  const response = await ai.generate({
    images: [],
    model: "mistral",
    prompt: `Provide textual markdown  in pretty format summary of the following report data in 100 words: ${json}`,
    stream: false,
  });

  return response;
}