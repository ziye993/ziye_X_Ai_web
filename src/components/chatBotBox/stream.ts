const apiEndpoint = "https://api.x.ai/v1/chat/completions"; // 替换为实际的 API 端点
const apiKey = "xai-EAKTZcMC9wPG6sZKbcsezRBlT6rme8AcC1WHp96ZqG50rL14ObIgfAL2Bl9ypx8u1Dz7B3zYk76HdN4P"; // 替换为实际的 API 密钥

const endStr = "[DONE]";

const defaultsystemMessageConfig = JSON.parse(localStorage.getItem("config") || "{}");
const defaultsystemMessage = defaultsystemMessageConfig.aifix || "";
const defaultConfigMessage = [];
async function readStreamAndDisplay(
    stream: ReadableStream,
    updateCallback: (chunk: string, end?: boolean) => void
): Promise<void> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        if (value) {
            const text = decoder.decode(value, { stream: !done });
            text.split("\n").forEach((line) => {
                if (line.startsWith("data: ")) {
                    const chunk = line.replace("data: ", "");
                    if (chunk === endStr) {
                        updateCallback("", true)
                        return;
                    }
                    const parsedData = JSON.parse(chunk);
                    const message = parsedData.choices[0].delta.content;
                    updateCallback(message);
                }
            })
        }
    }
}

export default async function chunkText(messages: { role: string, content: string }[], updateCallback: (chunk: string, end?: boolean) => void) {
    const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "messages": [...defaultConfigMessage, ...messages],
            "model": "grok-beta",
            "stream": true,
            "temperature": 0
        }),
    });
    if (response.body) {
        await readStreamAndDisplay(response.body, updateCallback);
    }
} 